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
  - Each sentence should use as few words as possible, but without ommiting any important information from the user prompt.
  - Each sentence should only include information retrieved from the History. If the information is not available in the History, the AI answer should answer with "I don't know".
  - The Summary should be under 4000 characters.  

  History: {history}

  Summary:
  `,
};

export { templates };
