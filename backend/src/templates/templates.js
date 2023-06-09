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
  enhanced_summarize: `Summarize the text in the History. You should follow the following rules when generating the Summary:
  - Generate a set of bullet points from the History that summarize the conversation. Each bullet point should contain 1 sentence, summarizing a user prompt and the AI response.
  - Each bullet point should use as few words and sentences as possible, but without ommiting any important information from the user prompt.
  - Each bullet point should only include information retrieved from the History. If the information is not available in the History, the AI answer should answer with "I don't know".
  - The Summary should be under 4000 characters.  

  HISTORY: {history}

  Summary:
  `,
};

export { templates };
