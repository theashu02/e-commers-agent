import { executeAgentWithEvents } from "../agent-runner"
import type { AgentStateType } from "../state"

export async function analystAgent(state: AgentStateType) {
  const analysis = await executeAgentWithEvents(
    "analystAgent",
    `Analyze this request using the research below.\n\nRequest: ${state.input}\nResearch: ${state.research}`,
  )
  return { analysis }
}
