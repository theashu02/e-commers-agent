import { getWriter } from "@langchain/langgraph"
import { model } from "@/lib/llm"
import type { AgentStateType } from "../state"

export async function researcherAgent(state: AgentStateType) {
  const writer = getWriter()
  const stream = await model.stream(
    `Give the most useful facts for this request. Request: ${state.input}\nCategory: ${state.classification}`,
  )
  let research = ""

  for await (const chunk of stream) {
    const text = chunk.content.toString()
    research += text
    writer?.(text)
  }

  return { research }
}
