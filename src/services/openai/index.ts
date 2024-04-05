import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources";
import { generatePrompt, generatePromptDetermine } from "./prompt";

if (!process.env.OPENAI_API_KEY) throw new Error("Missing required OpenAI environment variables.");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const run = async (
  name: string,
  history: ChatCompletionMessageParam[]
): Promise<string> => {
  const _prompt = generatePrompt(name);
  //   console.log('[prompt]: ', _prompt)

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: _prompt,
      },
      ...history,
    ],
    temperature: 1,
    max_tokens: 800,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  });

  return response.choices[0].message.content;
};
const getServiceDetermine = async (
  history: ChatCompletionMessageParam[]
): Promise<string> => {
  const _prompt = generatePromptDetermine();

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: _prompt,
      },
      ...history,
    ],
    temperature: 1,
    // max_tokens: 800,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  });
  console.log("[SERVICE CONTEXT]: ", response.choices[0].message);
  return response.choices[0].message.content;
};


const openAI = {
  run,
  getServiceDetermine
}
export { openAI };
