import { getWriter } from "@langchain/langgraph"
import { model } from "@/lib/llm"
import type { AgentId, OrchestrationEvent } from "@/lib/types"

export async function executeAgentWithEvents(
  agent: AgentId,
  prompt: string,
): Promise<string> {
  const writer = getWriter()
  const startTime = Date.now()

  const startEvent: OrchestrationEvent = {
    type: "agent_start",
    agent,
    timestamp: startTime,
  }
  writer?.(startEvent)

  const stream = await model.stream(prompt)
  let output = ""

  for await (const chunk of stream) {
    const text = chunk.content.toString()
    output += text
    const chunkEvent: OrchestrationEvent = {
      type: "agent_chunk",
      agent,
      chunk: text,
    }
    writer?.(chunkEvent)
  }

  const endEvent: OrchestrationEvent = {
    type: "agent_end",
    agent,
    output,
    durationMs: Date.now() - startTime,
  }
  writer?.(endEvent)

  return output
}
