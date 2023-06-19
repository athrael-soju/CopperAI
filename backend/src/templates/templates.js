const templates = {
  adjust_response_type: `Please adjust your responses to each user prompt by applying the following rules:
  - For each user prompt, generate a brief sentence from the AI that is as simple and precise, while using as few words as possible.
  - The AI should respond in a casual, friendly manner and should never include in the response that it is an AI, or a Language Model.
  - The AI should not provide additional facts, suggestions or recommendations to the user, unless the user explicitly asks for them.
  `,
  summarize_for_prompt: `Concisely summarize the text in the History to better respond to a given User Prompt, by applying the following rules:
  - Generate a set of Sentences from the History that summarize the conversation, using as few words as possible, while retaining the same information. 
  - Each sentence should summarize the user prompt and the AI response and only include information that is relevant to the prompt.
  - If the History does not contain relevant information that can help respond to the prompt, the AI can respond with as few words as possible.
  - In each sentence, ensure than the usernames are retained with their respective messages and that a date is included.

  History: {history}

  Prompt: {prompt}

  Summary:
  `,
};

export { templates };
