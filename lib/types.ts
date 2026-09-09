export type AgentId =
  | "classifierAgent"
  | "researcherAgent"
  | "analystAgent"
  | "decisionAgent"

export type AgentStatus = "idle" | "running" | "completed" | "error"

export interface AgentInfo {
  id: AgentId
  name: string
  role: string
  description: string
}

export const AGENT_REGISTRY: Record<AgentId, AgentInfo> = {
  classifierAgent: {
    id: "classifierAgent",
    name: "Classifier Agent",
    role: "Intent & Scope",
    description: "Categorizes and scopes the user request",
  },
  researcherAgent: {
    id: "researcherAgent",
    name: "Researcher Agent",
    role: "Market & Facts",
    description: "Finds relevant specifications, data, and facts",
  },
  analystAgent: {
    id: "analystAgent",
    name: "Analyst Agent",
    role: "Evaluation & Comparison",
    description: "Examines trade-offs, options, and advantages",
  },
  decisionAgent: {
    id: "decisionAgent",
    name: "Decision Agent",
    role: "Synthesis & Recommendation",
    description: "Synthesizes findings into the final clear recommendation",
  },
}

export const AGENT_PIPELINE_ORDER: AgentId[] = [
  "classifierAgent",
  "researcherAgent",
  "analystAgent",
  "decisionAgent",
]

export type OrchestrationEvent =
  | { type: "agent_start"; agent: AgentId; timestamp: number }
  | { type: "agent_chunk"; agent: AgentId; chunk: string }
  | {
      type: "agent_end"
      agent: AgentId
      output: string
      durationMs: number
    }
  | { type: "complete"; finalAnswer: string }
  | { type: "error"; message: string }

export interface AgentExecutionState {
  status: AgentStatus
  output: string
  durationMs?: number
}
