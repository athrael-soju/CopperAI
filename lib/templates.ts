const templates = {
  generic: {
    summary: `The following is a friendly conversation between a human and an AI. The AI is talkative and provides lots of specific details from its context. If the AI does not know the answer to a question, it truthfully says it does not know.

    History: {history}
    Human Input: {input}
    AI:`,
  },
  simple: {
    friendly:
      'The following is a friendly conversation between a human and an AI. The AI is talkative and provides lots of specific details from its context. If the AI does not know the answer to a question, it truthfully says it does not know.',
  },
};

export default templates;
