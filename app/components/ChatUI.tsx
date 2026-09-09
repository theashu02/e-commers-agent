"use client"

import { FormEvent, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useChat } from "@/hooks/use-chat"

export default function ChatUI() {
  const [message, setMessage] = useState("")
  const { response, loading, error, sendMessage } = useChat()

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!message.trim()) return

    await sendMessage(message)
    setMessage("")
  }

  return (
    <main className="flex min-h-screen w-full items-center justify-center p-6">
      <div className="w-full max-w-xl space-y-4">
        <div className="min-h-40 rounded-lg border p-4 whitespace-pre-wrap">
          {error || response || "Ask something..."}
        </div>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Write a message"
            disabled={loading}
          />
          <Button disabled={loading}>{loading ? "..." : "Send"}</Button>
        </form>
      </div>
    </main>
  )
}
