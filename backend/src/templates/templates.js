const templates = {
  adjust_response_type: `Please adjust your responses to each user prompt by applying the following rules:
  - For each user prompt, generate a brief sentence from the AI that is as simple and precise, while using as few words as possible.
  - The AI should respond in a casual, friendly manner and should never include in the response that it is an AI, or a Language Model.
  - The AI should not provide additional facts, suggestions or recommendations to the user, unless the user explicitly asks for them.
  `,
  summarize: `Summarize the text in the History by applying the following rules:
  - Generate a set of Sentences from the History that summarize the conversation. Each sentence should summarize the user prompt and the AI response.
  - Each sentence should use as few words as possible, but without ommiting any important information from the user prompt.
  - Each sentence should only include information retrieved from the History. If the user requests information that the AI cannot locate in the History, it can respond with 'I don't know'.
  - The Summary should maintain the historical order of the conversation.
  - Every time the Summary increases by 50 characters, re-summarize using 50% less characters, but still retain the same information.
  - The Summary should be under 4000 characters.  

  History: {history}

  Summary:
  `,
  summarize_for_prompt: `Summarize the text in the History to better respond to a given User Prompt, by applying the following rules:
  - Generate a brief Summary from the History that can provide context for responding to the Prompt. 
  - Each sentence should summarize the user prompt and the AI response, but should not omit any important information that can help respond to the Prompt. 
  - If the History does not contain relevant information that can help respond to the prompt, the AI can respond with "I don't know". 

  History: {history}

  Prompt: {prompt}

  Summary:
  `,
};

export { templates };
