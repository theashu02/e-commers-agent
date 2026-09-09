export async function* streamChatResponse(message: string) {
  const result = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  })

  if (!result.ok || !result.body) {
    throw new Error("Unable to get a response")
  }

  const reader = result.body.getReader()
  const decoder = new TextDecoder()

  while (true) {
    const { value, done } = await reader.read()
    if (done) break

    const chunk = decoder.decode(value, { stream: true })
    if (chunk) yield chunk
  }

  const remaining = decoder.decode()
  if (remaining) yield remaining
}
