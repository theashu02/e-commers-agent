import type { OrchestrationEvent } from "@/lib/types"

export async function* streamChatResponse(
  message: string,
): AsyncGenerator<OrchestrationEvent, void, unknown> {
  const result = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  })

  if (!result.ok || !result.body) {
    const errorData = await result.json().catch(() => null)
    throw new Error(
      errorData?.error || "Unable to connect to the agent orchestration service",
    )
  }

  const reader = result.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ""

  try {
    while (true) {
      const { value, done } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split("\n")
      buffer = lines.pop() ?? ""

      for (const line of lines) {
        const trimmed = line.trim()
        if (!trimmed) continue
        try {
          const event = JSON.parse(trimmed) as OrchestrationEvent
          yield event
        } catch {
          // Ignore incomplete or non-JSON line
        }
      }
    }

    buffer += decoder.decode()
    if (buffer.trim()) {
      try {
        const event = JSON.parse(buffer.trim()) as OrchestrationEvent
        yield event
      } catch {
        // Ignore
      }
    }
  } finally {
    reader.releaseLock()
  }
}
