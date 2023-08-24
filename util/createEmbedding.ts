export const createEmbeddings = async ({ token, model, input }) => {
    const response = await fetch('https://api.openai.com/v1/embeddings', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      method: 'POST',
      body: JSON.stringify({ input, model }),
    });
  
    const { error, data, usage } = await response.json();
  
    return data;
};