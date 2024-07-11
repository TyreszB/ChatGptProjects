import OpenAI from "openai";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function startCompletionStream(text) {
  const res = await openai.chat.completions.create(
    {
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: text }],
      temperature: 1,
      max_tokens: 50,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      stream: true,
    },
    {
      responseType: "stream",
    }
  );

  for await (const chunk of res) {
    res.write(chunk.choices[0]?.delta?.content || "");
  }
}

app.post("/api/chatgpt", async (req, res) => {
  try {
    const { text } = req.body;
    await startCompletionStream(text);
  } catch (error) {
    if (error.res) {
      console.error(error.res.status, error.res.data);
      res.status(error.res.status).json();
    } else {
      console.error("Error with OPENAPI request", error.message);
      res.status(500).json({
        error: {
          message: "An error occured during your request.",
        },
      });
    }
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started on port: ${PORT}`));
