import { useState } from "react"
import { streamChatResponse } from "@/lib/api/chat"

export function useChat() {
  const [response, setResponse] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function sendMessage(message: string) {
    if (!message.trim()) return

    setResponse("")
    setError("")
    setLoading(true)

    try {
      for await (const chunk of streamChatResponse(message)) {
        setResponse((current) => current + chunk)
      }
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Something went wrong",
      )
    } finally {
      setLoading(false)
    }
  }

  return { response, loading, error, sendMessage }
}
