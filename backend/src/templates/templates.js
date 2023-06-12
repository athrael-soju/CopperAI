const templates = {
  summarize: `Summarize the text in the HISTORY. You should follow the following rules when generating the Summary:
  - Bullet Points found in the HISTORY should not be preserved in the Summary.
  - The Summary should only include information retrieved from the HISTORY.
  - The Summary should be 2000 characters long, if possible and under 4000 characters.  
  - The Summary should include who the conversation is with and specify who send each message. 
  - The Summary should be explicit and no details of the discussion should be simplified.

  HISTORY: {history}

  Summary:
  `,
  enhanced_summarize: `Summarize the text in the History by applying the following rules:
  - Generate a set of Sentences from the History that summarize the conversation. Each sentence should summarize the user prompt and the AI response.
  - Each sentence should use as few words as possible, but without ommiting any important information from the user prompt. The AI response can be simplified further, but should still be coherent.
  - Each sentence should only include information retrieved from the History. If the user requests information that the AI cannot locate in the History, do not include the AI's response in the sentence.
  - The Summary should maintain the historical order of the conversation.
  - Every time the Summary increases by 50 characters, re-summarize using 50% less characters, but still retain the same information.
  - The Summary should be under 4000 characters.  

  History: {history}

  Summary:
  `,
  summarize_for_prompt: `Summarize the text in the History to better respond to a given User Prompt, by applying the following rules:
  - Generate a brief summary from the History that is relevant to the Prompt.
  - The summary should use as few words from the History as possible, but retain relevant context that can be used to respond to the Prompt.
  - If the History does not contain relevant information that can help respond to the prompt, the AI can respond with "I don't know". 

  History: {history}

  Prompt: {prompt}

  Summary:
  `,
};

export { templates };
