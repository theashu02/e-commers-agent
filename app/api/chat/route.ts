import { agentGraph } from "@/agents/graph"
import type { OrchestrationEvent } from "@/lib/types"

export const runtime = "nodejs"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const message = body?.message

    if (typeof message !== "string" || !message.trim()) {
      return Response.json({ error: "Message is required" }, { status: 400 })
    }

    const stream = await agentGraph.stream(
      { input: message.trim() },
      { streamMode: "custom" },
    )
    const encoder = new TextEncoder()

    return new Response(
      new ReadableStream({
        async start(controller) {
          try {
            for await (const chunk of stream) {
              if (chunk && typeof chunk === "object") {
                controller.enqueue(
                  encoder.encode(JSON.stringify(chunk) + "\n"),
                )
              }
            }
            controller.close()
          } catch (error) {
            const errorEvent: OrchestrationEvent = {
              type: "error",
              message:
                error instanceof Error
                  ? error.message
                  : "An unexpected error occurred during execution.",
            }
            controller.enqueue(
              encoder.encode(JSON.stringify(errorEvent) + "\n"),
            )
            controller.close()
          }
        },
      }),
      {
        headers: {
          "Content-Type": "application/x-ndjson; charset=utf-8",
          "Cache-Control": "no-cache, no-transform",
          Connection: "keep-alive",
        },
      },
    )
  } catch (error) {
    return Response.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to process request",
      },
      { status: 500 },
    )
  }
}
