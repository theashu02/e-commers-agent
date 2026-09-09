import { getWriter } from "@langchain/langgraph"
import { model } from "@/lib/llm"
import type { AgentStateType } from "../state"

export async function analystAgent(state: AgentStateType) {
  const writer = getWriter()
  const stream = await model.stream(
    `Analyze this request using the research below.\n\nRequest: ${state.input}\nResearch: ${state.research}`,
  )
  let analysis = ""

  for await (const chunk of stream) {
    const text = chunk.content.toString()
    analysis += text
    writer?.(text)
  }

  return { analysis }
}
