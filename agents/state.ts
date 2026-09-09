import { Annotation } from "@langchain/langgraph"

export const AgentState = Annotation.Root({
  input: Annotation<string>,
  classification: Annotation<string>,
  research: Annotation<string>,
  analysis: Annotation<string>,
  decision: Annotation<string>,
})

export type AgentStateType = typeof AgentState.State
