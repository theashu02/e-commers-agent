import { executeAgentWithEvents } from "../agent-runner"
import type { AgentStateType } from "../state"

export async function decisionAgent(state: AgentStateType) {
  const decision = await executeAgentWithEvents(
    "decisionAgent",
    `Give a concise final answer to the request using this analysis:\n\n${state.analysis}`,
  )
  return { decision }
}
