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

async function runCompletion(prompt) {
  const res = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
  });

  return res;
}

app.post("/api/chatgpt", async (req, res) => {
  try {
    const { text } = req.body;

    const completion = await runCompletion(text);

    res.json(completion);
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
