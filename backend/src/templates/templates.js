const templates = {
  summarize: `Shorten the text in the HISTORY. You should follow the following rules when generating the Summary:
  - Any Bullet Points found in the HISTORY should ALWAYS be preserved in the Summary, unchanged.
  - Code will be surrounded by backticks (\`) or triple backticks (\`\`\`).
  - The Summary should only include information retrieved from the HISTORY. Do not insert any additional information. If the Summary cannot be generated, it should be empty.
  - The Summary should be under 4000 characters.
  - The Summary should be 2000 characters long, if possible.

  HISTORY: {history}

  Summary:
  `,
};

export { templates };
