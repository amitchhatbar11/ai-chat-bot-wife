require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { openAiAPI, promptsForOpenAi, imageApi } = require("./util");

const app = express();
const port = 3001;

app.use(bodyParser.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("AI Chatbot Wife Backend");
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

app.post("/chat", async (req, res) => {
  const { character, timeOfDay, userMessage, context, imagePromptContext } =
    req.body;

  console.log(`before context: ${context}`);
  console.log(`before imagePromptContext: ${imagePromptContext}`);
  // Generate a prompt based on character and timeOfDay

  try {
    const promptForUser = promptsForOpenAi(
      character,
      timeOfDay,
      userMessage,
      true
    );
    const promptForImage = promptsForOpenAi(
      character,
      timeOfDay,
      userMessage,
      false
    );

    const lastItem = context.pop();
    const lastItemImage = imagePromptContext.pop();

    lastItem.content = promptForUser;
    context.push(lastItem);

    if (!lastItem) {
      context.push({ role: "user", content: promptForUser });
    } else {
      lastItem.content = promptForUser;
      context.push(lastItem);
    }

    if (!lastItemImage) {
      imagePromptContext.push({ role: "user", content: promptForImage });
    } else {
      lastItemImage.content = promptForImage;
      imagePromptContext.push(lastItemImage);
    }

    console.log(`context: ${context}`);
    console.log(`imagePromptContext: ${imagePromptContext}`);
    const responseForUser = await openAiAPI(context);

    const responseForImage = await openAiAPI(imagePromptContext);

    const imagePrompt = responseForImage.content.replace(/\n/g, " ");
    const imageResponse = await imageApi(imagePrompt);
    const data = await imageResponse.json();
    res.json({
      chatResponse: responseForUser.content,
      imageResponse: data.images,
      imagePrompt,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to get response from OpenAI" });
  }
});
