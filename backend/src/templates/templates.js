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
};

export { templates };
