import { OpenAI } from 'langchain/llms/openai';
import { VectorStoreRetrieverMemory } from 'langchain/memory';
import { LLMChain } from 'langchain/chains';
import { PromptTemplate } from 'langchain/prompts';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { ConversationSummaryMemory } from 'langchain/memory';
import logger from '../../lib/winstonConfig';
const model = new OpenAI({
  temperature: 0.9,
  modelName: process.env.NEXT_PUBLIC_OPENAI_API_MODEL,
  openAIApiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

export function getPromptTemplate(template: string, inputVariables: string[]) {
  return new PromptTemplate({
    template,
    inputVariables: inputVariables,
  });
}

export function getChain(template: PromptTemplate) {
  return new LLMChain({
    llm: model,
    prompt: template,
  });
}

export async function getResult(
  llmChain: LLMChain<string, OpenAI>,
  template: PromptTemplate,
  input: string,
  history: string
) {
  return await llmChain.call({
    prompt: template,
    input,
    history,
  });
}

// First let's save some information to memory, as it would happen when
// used inside a chain.
export async function lanchainVectorStoreRetrieverMemory() {
  const vectorStore = new MemoryVectorStore(
    new OpenAIEmbeddings({
      openAIApiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
    })
  );
  const memory = new VectorStoreRetrieverMemory({
    // 1 is how many documents to return, you might want to return more, eg. 4
    vectorStoreRetriever: vectorStore.asRetriever(1),
    memoryKey: 'history',
  });

  await memory.saveContext(
    { input: 'My favorite food is pizza' },
    { output: 'thats good to know' }
  );
  await memory.saveContext(
    { input: 'My favorite sport is soccer' },
    { output: '...' }
  );
  await memory.saveContext({ input: "I don't the Celtics" }, { output: 'ok' });

  // Now let's use the memory to retrieve the information we saved.
  console.log(
    await memory.loadMemoryVariables({ prompt: 'what sport should i watch?' })
  );
  /*
{ history: 'input: My favorite sport is soccer\noutput: ...' }
*/

  // Now let's use it in a chain.
  const model = new OpenAI({
    temperature: 0.9,
    modelName: process.env.NEXT_PUBLIC_OPENAI_API_MODEL,
    openAIApiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  });
  const prompt =
    PromptTemplate.fromTemplate(`The following is a friendly conversation between a human and an AI. The AI is talkative and provides lots of specific details from its context. If the AI does not know the answer to a question, it truthfully says it does not know.

Relevant pieces of previous conversation:
{history}

(You do not need to use these pieces of information if not relevant)

Current conversation:
Human: {input}
AI:`);
  const chain = new LLMChain({ llm: model, prompt, memory });

  const res1 = await chain.call({ input: "Hi, my name is Perry, what's up?" });
  console.log({ res1 });
  /*
{
  res1: {
    text: " Hi Perry, I'm doing great! I'm currently exploring different topics related to artificial intelligence like natural language processing and machine learning. What about you? What have you been up to lately?"
  }
}
*/

  const res2 = await chain.call({ input: "what's my favorite sport?" });
  console.log({ res2 });
  /*
{ res2: { text: ' You said your favorite sport is soccer.' } }
*/

  const res3 = await chain.call({ input: "what's my name?" });
  console.log({ res3 });
  /*
{ res3: { text: ' Your name is Perry.' } }
*/
}
