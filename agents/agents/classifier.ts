import { executeAgentWithEvents } from "../agent-runner"
import type { AgentStateType } from "../state"

export async function classifierAgent(state: AgentStateType) {
  const classification = await executeAgentWithEvents(
    "classifierAgent",
    `Classify the following request in one short sentence:\n\n${state.input}`,
  )
  return { classification }
}
