import { END, START, StateGraph } from "@langchain/langgraph"
import { analystAgent } from "./agents/analyst"
import { classifierAgent } from "./agents/classifier"
import { decisionAgent } from "./agents/decision"
import { researcherAgent } from "./agents/researcher"
import { AgentState } from "./state"

export const agentGraph = new StateGraph(AgentState)
  .addNode("classifierAgent", classifierAgent)
  .addNode("researcherAgent", researcherAgent)
  .addNode("analystAgent", analystAgent)
  .addNode("decisionAgent", decisionAgent)
  .addEdge(START, "classifierAgent")
  .addEdge("classifierAgent", "researcherAgent")
  .addEdge("researcherAgent", "analystAgent")
  .addEdge("analystAgent", "decisionAgent")
  .addEdge("decisionAgent", END)
  .compile()
