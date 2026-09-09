"use client"

import { FormEvent, useState } from "react"
import {
  ArrowUpRight,
  Bot,
  Check,
  Copy,
  Lightbulb,
  RotateCcw,
  Send,
  ShoppingBag,
  Sparkles,
} from "lucide-react"
import { AgentOrchestrator } from "@/components/agent-orchestrator"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { useChat } from "@/hooks/use-chat"

const SUGGESTED_QUERIES = [
  "Best lightweight laptops for students under $1000",
  "Compare mechanical keyboard switches for typing vs gaming",
  "Top noise-cancelling headphones for long flights",
]

export default function ChatUI() {
  const [inputMessage, setInputMessage] = useState("")
  const [copiedAnswer, setCopiedAnswer] = useState(false)
  const {
    activeAgentId,
    agentStates,
    finalAnswer,
    currentPrompt,
    loading,
    error,
    sendMessage,
    reset,
  } = useChat()

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!inputMessage.trim() || loading) return

    const query = inputMessage
    setInputMessage("")
    await sendMessage(query)
  }

  const handleSuggestionClick = async (suggestion: string) => {
    if (loading) return
    setInputMessage("")
    await sendMessage(suggestion)
  }

  const handleCopyAnswer = async () => {
    if (!finalAnswer) return
    await navigator.clipboard.writeText(finalAnswer)
    setCopiedAnswer(true)
    setTimeout(() => setCopiedAnswer(false), 2000)
  }

  const hasActivity =
    Boolean(currentPrompt) ||
    Boolean(finalAnswer) ||
    Boolean(error) ||
    loading ||
    Object.values(agentStates).some((s) => s.status !== "idle")

  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col items-center justify-between p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-4xl space-y-6">
        {/* Header */}
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-border/60 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10 text-primary border border-primary/20">
              <ShoppingBag className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-semibold tracking-tight text-foreground">
                  E-Commerce Agent Studio
                </h1>
                <Badge variant="outline" className="text-[11px] font-mono">
                  LangGraph
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Autonomous multi-agent orchestration with real-time state tracking
              </p>
            </div>
          </div>

          {hasActivity && (
            <Button
              variant="outline"
              size="sm"
              onClick={reset}
              disabled={loading}
              className="gap-1.5 text-xs text-muted-foreground hover:text-foreground"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset
            </Button>
          )}
        </header>

        {/* Real-time Agent Orchestrator Visualizer */}
        <AgentOrchestrator
          activeAgentId={activeAgentId}
          agentStates={agentStates}
          isLoading={loading}
        />

        {/* Current Query Banner */}
        {currentPrompt && (
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-muted/40 border border-border/60 text-xs text-muted-foreground">
            <span className="font-semibold text-foreground">Prompt:</span>
            <span className="truncate italic">{currentPrompt}</span>
          </div>
        )}

        {/* Final Synthesized Response Card */}
        {finalAnswer ? (
          <Card className="border border-border/80 bg-card shadow-xs">
            <CardHeader className="py-3 px-4 border-b border-border/60 flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <CardTitle className="text-xs font-semibold uppercase tracking-wider text-foreground">
                  Final Synthesized Recommendation
                </CardTitle>
                <Badge
                  variant="secondary"
                  className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px]"
                >
                  Decision Output
                </Badge>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground hover:text-foreground"
                onClick={handleCopyAnswer}
                title="Copy response"
              >
                {copiedAnswer ? (
                  <Check className="h-3.5 w-3.5 text-emerald-500" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
              </Button>
            </CardHeader>
            <CardContent className="p-4 sm:p-5">
              <div className="text-sm leading-relaxed whitespace-pre-wrap text-foreground/90 font-normal">
                {finalAnswer}
              </div>
            </CardContent>
          </Card>
        ) : error ? (
          <div className="p-4 rounded-xl border border-destructive/40 bg-destructive/10 text-destructive text-xs">
            <div className="font-semibold mb-1">Execution Error</div>
            {error}
          </div>
        ) : !loading ? (
          /* Empty State & Prompt Suggestions */
          <div className="rounded-xl border border-dashed border-border/80 p-6 text-center space-y-4 bg-muted/10">
            <div className="inline-flex p-3 rounded-full bg-primary/10 text-primary">
              <Bot className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-foreground">
                Ask an e-commerce question to watch the agents collaborate
              </h3>
              <p className="text-xs text-muted-foreground max-w-md mx-auto">
                The query will flow sequentially through the Classifier,
                Researcher, Analyst, and Decision engines in real time.
              </p>
            </div>

            <Separator className="my-2" />

            <div className="space-y-2">
              <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground font-medium">
                <Lightbulb className="h-3.5 w-3.5 text-amber-500" />
                <span>Try an example prompt:</span>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-2">
                {SUGGESTED_QUERIES.map((query) => (
                  <button
                    key={query}
                    type="button"
                    onClick={() => handleSuggestionClick(query)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs bg-card border border-border/70 hover:border-primary/50 hover:bg-accent/40 text-foreground transition-all cursor-pointer"
                  >
                    <span>{query}</span>
                    <ArrowUpRight className="h-3 w-3 text-muted-foreground" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : null}

        {/* Input Form */}
        <div className="pt-2">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask an e-commerce query (e.g., 'Compare best budget wireless earbuds')..."
              disabled={loading}
              className="h-10 text-xs sm:text-sm bg-card border-border/80 focus-visible:ring-primary"
            />
            <Button
              type="submit"
              disabled={loading || !inputMessage.trim()}
              className="h-10 px-4 text-xs font-medium gap-1.5 cursor-pointer"
            >
              {loading ? (
                <>
                  <span className="h-3.5 w-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  <span>Processing</span>
                </>
              ) : (
                <>
                  <span>Send</span>
                  <Send className="h-3.5 w-3.5" />
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
    </main>
  )
}
