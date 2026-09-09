import { executeAgentWithEvents } from "../agent-runner"
import type { AgentStateType } from "../state"

export async function researcherAgent(state: AgentStateType) {
  const research = await executeAgentWithEvents(
    "researcherAgent",
    `Give the most useful facts for this request. Request: ${state.input}\nCategory: ${state.classification}`,
  )
  return { research }
}
