import logger from '../lib/winstonConfig';
//logger.defaultMeta = { service: 'lib/langchain.ts' };

import templates from './templates';
import { getPromptTemplate, getChain, getResult } from './client/langchain';

export const summarizeConversation = async (
  message: string,
  conversationHistory: string
) => {
  logger.info(`Summarizing Conversation...`);
  const template = getPromptTemplate(templates.generic.summary, [
    'input',
    'history',
  ]);
  const chain = getChain(template);
  const result = await getResult(chain, template, message, conversationHistory);
  logger.info(`Summarized Conversation: ${result.text}`);
  return result.text;
};
