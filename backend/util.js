const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const openAiAPI = async (context) => {
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: context,
  });

  return response.choices[0].message;
};

const promptsForOpenAi = (character, timeOfDay, userMessage, forUser) => {
  const initialText = `Suppose You are ${character} and it's ${timeOfDay} in your home. This is user message: ${userMessage}
Suppose You are ${character} and it's ${timeOfDay} in your home. This is user message: ${userMessage}`;
  const promptForUser = `${initialText}. Generate a short line of text that ${character} 
  would say in response to the user message in flirty manner and seducively. Mention your movement in along with the response. Talk with user in the first person.`;
  const promptForImage = `${initialText}. Please, generate a very highly detailed prompt message to generate'
   an image of a ${character} in the ${timeOfDay} which I can give to image model. Strictly no explicit and nude content.`;
  return forUser ? promptForUser : promptForImage;
};

const imageApi = async (imagePrompt) => {
  const response = await fetch(
    `${process.env.STABLE_DIFFUSION_ENDPOINT}/sdapi/v1/txt2img`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: `${process.env.POSITIVE_PROMPT}. ${imagePrompt}`,
        negative_prompt: `${process.env.NEGATIVE_PROMPT}`,
        steps: 50,
      }),
    }
  );

  // Check if the response is OK (status 200-299)
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  return response;
};

module.exports = { openAiAPI, promptsForOpenAi, imageApi };
