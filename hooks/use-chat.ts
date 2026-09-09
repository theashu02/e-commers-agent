import { useCallback, useState } from "react"
import { streamChatResponse } from "@/lib/api/chat"
import {
  AGENT_PIPELINE_ORDER,
  type AgentExecutionState,
  type AgentId,
} from "@/lib/types"

const createInitialAgentStates = (): Record<AgentId, AgentExecutionState> => {
  return AGENT_PIPELINE_ORDER.reduce(
    (acc, id) => {
      acc[id] = { status: "idle", output: "" }
      return acc
    },
    {} as Record<AgentId, AgentExecutionState>,
  )
}

export function useChat() {
  const [activeAgentId, setActiveAgentId] = useState<AgentId | null>(null)
  const [agentStates, setAgentStates] = useState<
    Record<AgentId, AgentExecutionState>
  >(createInitialAgentStates)
  const [finalAnswer, setFinalAnswer] = useState("")
  const [currentPrompt, setCurrentPrompt] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const reset = useCallback(() => {
    setActiveAgentId(null)
    setAgentStates(createInitialAgentStates())
    setFinalAnswer("")
    setError("")
    setCurrentPrompt("")
  }, [])

  const sendMessage = useCallback(
    async (message: string) => {
      if (!message.trim() || loading) return

      const cleanMessage = message.trim()
      setCurrentPrompt(cleanMessage)
      setFinalAnswer("")
      setError("")
      setLoading(true)
      setActiveAgentId(null)
      setAgentStates(createInitialAgentStates())

      try {
        for await (const event of streamChatResponse(cleanMessage)) {
          if (event.type === "agent_start") {
            setActiveAgentId(event.agent)
            setAgentStates((prev) => ({
              ...prev,
              [event.agent]: {
                status: "running",
                output: "",
              },
            }))
          } else if (event.type === "agent_chunk") {
            setAgentStates((prev) => {
              const current = prev[event.agent] || {
                status: "running",
                output: "",
              }
              return {
                ...prev,
                [event.agent]: {
                  ...current,
                  status: "running",
                  output: current.output + event.chunk,
                },
              }
            })
          } else if (event.type === "agent_end") {
            setAgentStates((prev) => ({
              ...prev,
              [event.agent]: {
                status: "completed",
                output: event.output,
                durationMs: event.durationMs,
              },
            }))
            if (event.agent === "decisionAgent") {
              setFinalAnswer(event.output)
            }
          } else if (event.type === "error") {
            setError(event.message)
            if (activeAgentId) {
              setAgentStates((prev) => ({
                ...prev,
                [activeAgentId]: {
                  ...prev[activeAgentId],
                  status: "error",
                },
              }))
            }
          }
        }
      } catch (err) {
        const errorMsg =
          err instanceof Error ? err.message : "Failed to execute orchestration"
        setError(errorMsg)
      } finally {
        setLoading(false)
        setActiveAgentId(null)
      }
    },
    [loading, activeAgentId],
  )

  return {
    activeAgentId,
    agentStates,
    finalAnswer,
    currentPrompt,
    loading,
    error,
    sendMessage,
    reset,
  }
}
