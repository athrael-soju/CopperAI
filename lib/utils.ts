import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { PineconeStore } from 'langchain/vectorstores/pinecone';
import { getChain } from '@/lib/langchain';
import { ChatMessage } from 'langchain/schema';
import {
  getIndex,
  queryMessageInPinecone,
  upsertConversationToPinecone,
} from '@/lib/pinecone';
import { getHistory, updateHistory } from '@/lib/database';
import { ChatCompletionRequestMessage } from 'openai';
import { createChatCompletion } from '@/lib/openAI';
import templates from './templates';
import { createServiceLogger } from '@/lib/winstonConfig';
const serviceLogger = createServiceLogger('lib/utils.ts');

const openAIapiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY as string;
const useHistory = process.env.NEXT_PUBLIC_USE_CHAT_HISTORY === 'true';
const topK = Number(process.env.NEXT_PUBLIC_TOP_K_MESSAGES);

// Send a prompt via LangChain
export const sendViaLangChain = async (
  username: string,
  sanitizedPrompt: string,
  namespace: string,
  temperature: number,
  returnSourceDocuments: boolean
) => {
  try {
    const index = await getIndex();
    const vectorStore = await PineconeStore.fromExistingIndex(
      new OpenAIEmbeddings({
        openAIApiKey: openAIapiKey,
      }),
      {
        pineconeIndex: index,
        textKey: 'pageContent',
        namespace: `${username}_${namespace}`,
      }
    );

    const chain = getChain(
      vectorStore,
      returnSourceDocuments,
      temperature,
      namespace
    );

    let history: ChatMessage[] = [];
    if (useHistory) {
      history = await getHistory(username, namespace);
    }
    let response;
    if (namespace === 'document') {
      response = await chain?.call({
        question: sanitizedPrompt,
        chat_history: history,
      });
    } else if (namespace === 'general') {
      response = await chain?.call({
        question: sanitizedPrompt,
      });
    } else {
      response = { text: 'Unable to generate response' };
    }
    let newId = await updateHistory(
      username,
      namespace,
      sanitizedPrompt,
      response?.text
    );
    return {
      successful: true,
      prompt: sanitizedPrompt,
      response: response?.text,
      conversationId: newId,
    };
  } catch (err) {
    return { successful: false, message: err };
  }
};

// Send a prompt to OpenAI's chat completion API
export const sendViaChatCompletion = async (
  username: string,
  sanitizedPrompt: string,
  namespace: string
) => {
  let messages: ChatCompletionRequestMessage[] = [];

  let history: string[] = [];
  if (useHistory) {
    history = await getHistory(username, namespace);
    messages.push({
      role: 'system',
      content: `History of Last ${topK} Messages:\n${history}`,
    });
  }

  let context = await queryMessageInPinecone(
    username,
    sanitizedPrompt,
    namespace
  );

  let templatedContext =
    namespace === 'document'
      ? templates.document_qa.simplified_qa_prompt
      : namespace === 'general'
      ? templates.general.simplified_general
      : '';

  templatedContext += `Related Context:\n${context}`;
  messages.push({
    role: 'system',
    content: templatedContext,
  });

  messages.push({
    role: 'user',
    content: sanitizedPrompt,
  });
  return createChatCompletion(messages, username)
    .then(async (response) => {
      const responseContent = response?.data?.choices[0]?.message
        ?.content as string;
      serviceLogger.info('Chat Completion Response:', {
        response: responseContent,
      });
      let newId = await updateHistory(
        username,
        namespace,
        sanitizedPrompt,
        responseContent
      );
      await upsertConversationToPinecone(
        username,
        sanitizedPrompt,
        responseContent,
        namespace,
        newId
      );

      return {
        successful: true,
        prompt: sanitizedPrompt,
        response: responseContent,
        conversationId: newId,
      };
    })
    .catch((error) => {
      serviceLogger.error('Chat Completion Request Unsuccessful', {
        error: error.message,
      });
      return { successful: false, message: error };
    });
};
