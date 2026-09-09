import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatOpenAI } from "@langchain/openai";

const prompt = ChatPromptTemplate.fromMessages([
  ["system", "You are a helpful assistant."],
  ["human", "{message}"],
]);

export const model = new ChatOpenAI({
  model: "google/gemma-3-27b-it",
  temperature: 0.1,
  apiKey: process.env.OPENAI_API_KEY,
  configuration: {
    baseURL: "https://openrouter.ai/api/v1",
  },
});

export function streamChat(message: string) {
  return prompt.pipe(model).stream({ message });
}