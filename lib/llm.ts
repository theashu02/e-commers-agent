import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatOpenAI } from "@langchain/openai";

const prompt = ChatPromptTemplate.fromMessages([
  ["system", "You are a helpful assistant."],
  ["human", "{message}"],
]);

export const model = new ChatOpenAI({
  model: "nvidia/nemotron-3-ultra-550b-a55b:free",
  temperature: 0,
  apiKey: process.env.OPENAI_API_KEY,
  configuration: {
    baseURL: "https://openrouter.ai/api/v1",
  },
});

export function streamChat(message: string) {
  return prompt.pipe(model).stream({ message });
}