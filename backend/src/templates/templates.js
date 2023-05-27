const templates = {
  summarizer: `Shorten the text in the CONTENT, attempting to answer the INQUIRY You should follow the following rules when generating the summary:
  - Any code found in the CONTENT should ALWAYS be preserved in the summary, unchanged.
  - Code will be surrounded by backticks (\`) or triple backticks (\`\`\`).
  - Summary should include code examples that are relevant to the INQUIRY, based on the content. Do not make up any code examples on your own.
  - The summary will answer the INQUIRY. If it cannot be answered, the summary should be empty, AND NO TEXT SHOULD BE RETURNED IN THE FINAL ANSWER AT ALL.
  - If the INQUIRY cannot be answered, the final answer should be empty.
  - The summary should be under 4000 characters.
  - The summary should be 2000 characters long, if possible.

  INQUIRY: { message }
  CONTENT: { history}

  Final answer:
  `,
};

export { templates };
