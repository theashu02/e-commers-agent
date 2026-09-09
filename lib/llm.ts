import { ChatPromptTemplate } from "@langchain/core/prompts"
import { ChatOpenAI } from "@langchain/openai"

const prompt = ChatPromptTemplate.fromMessages([
  ["system", "You are a helpful assistant."],
  ["human", "{message}"],
])

const model = new ChatOpenAI({
  model: "gpt-4o-mini",
  temperature: 0.1,
})

export function streamChat(message: string) {
  return prompt.pipe(model).stream({ message })
}
