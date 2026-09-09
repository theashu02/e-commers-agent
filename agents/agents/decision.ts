import { getWriter } from "@langchain/langgraph"
import { model } from "@/lib/llm"
import type { AgentStateType } from "../state"

export async function decisionAgent(state: AgentStateType) {
  const writer = getWriter()
  const stream = await model.stream(
    `Give a concise final answer to the request using this analysis:\n\n${state.analysis}`,
  )
  let decision = ""

  for await (const chunk of stream) {
    const text = chunk.content.toString()
    decision += text
    writer?.(text)
  }

  return { decision }
}
