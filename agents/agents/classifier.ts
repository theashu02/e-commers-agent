import { getWriter } from "@langchain/langgraph"
import { model } from "@/lib/llm"
import type { AgentStateType } from "../state"

export async function classifierAgent(state: AgentStateType) {
  const writer = getWriter()
  const stream = await model.stream(
    `Classify the following request in one short sentence:\n\n${state.input}`,
  )
  let classification = ""

  for await (const chunk of stream) {
    const text = chunk.content.toString()
    classification += text
    writer?.(text)
  }

  return { classification }
}
