import { GoogleGenerativeAI } from "@google/generative-ai";
import { generatePrompt } from "./prompt";

if (!process.env.GEMINI_API_KEY) throw new Error("Missing required Google Gemini environment variables.");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function run(texto: string, history: any, message: string) {
  try {
    const generationConfig = {
      stopSequences: ["red"],
      maxOutputTokens: 200,
      temperature: 0.9,
      topP: 0.1,
      topK: 16,
    };

    const model = genAI.getGenerativeModel({
      model: "gemini-pro",
      generationConfig,
    });

    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [
            {
              text: generatePrompt(texto.slice(0, 200)),
            },
          ],
        },
        {
          role: "model",
          parts: [
            {
              text: "Entendido, hazme una pregunta del documento. ",
            },
          ],
        },
        ...history,
      ],
    });

    const result = await chat.sendMessage(message);

    const text = result.response.text();

    return text;
  } catch (error) {
    console.log("error", error);
  }
}


const Gemini = {
  run,
};

export { Gemini };
