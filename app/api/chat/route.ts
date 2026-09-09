import { streamChat } from "@/lib/llm"

export async function POST(request: Request) {
  const { message } = await request.json()

  if (typeof message !== "string" || !message.trim()) {
    return Response.json({ error: "Message is required" }, { status: 400 })
  }

  const stream = await streamChat(message)
  const encoder = new TextEncoder()

  return new Response(
    new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            if (typeof chunk.content === "string") {
              controller.enqueue(encoder.encode(chunk.content))
            }
          }
          controller.close()
        } catch (error) {
          controller.error(error)
        }
      },
    }),
    { headers: { "Content-Type": "text/plain; charset=utf-8" } },
  )
}
