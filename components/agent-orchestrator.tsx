"use client"

import { useMemo, useState } from "react"
import {
  AlertCircle,
  ArrowRight,
  BarChart3,
  Bot,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  Copy,
  Cpu,
  Eye,
  Loader2,
  Search,
  Sparkles,
  Tag,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  AGENT_PIPELINE_ORDER,
  AGENT_REGISTRY,
  type AgentExecutionState,
  type AgentId,
  type AgentStatus,
} from "@/lib/types"

interface AgentOrchestratorProps {
  activeAgentId: AgentId | null
  agentStates: Record<AgentId, AgentExecutionState>
  isLoading: boolean
}

const AGENT_ICONS: Record<AgentId, React.ElementType> = {
  classifierAgent: Tag,
  researcherAgent: Search,
  analystAgent: BarChart3,
  decisionAgent: Sparkles,
}

export function AgentOrchestrator({
  activeAgentId,
  agentStates,
  isLoading,
}: AgentOrchestratorProps) {
  const [selectedAgent, setSelectedAgent] = useState<AgentId | null>(null)
  const [isInspectorExpanded, setIsInspectorExpanded] = useState(true)
  const [copied, setCopied] = useState(false)

  // Automatically focus on active agent or default to decision agent if done
  const displayedAgentId = useMemo(() => {
    if (selectedAgent) return selectedAgent
    if (activeAgentId) return activeAgentId
    // If complete and has output, default to decisionAgent
    if (agentStates.decisionAgent.output) return "decisionAgent"
    return null
  }, [selectedAgent, activeAgentId, agentStates])

  const displayedAgentData = displayedAgentId
    ? agentStates[displayedAgentId]
    : null

  const handleCopy = async (text: string) => {
    if (!text) return
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const getStatusBadge = (status: AgentStatus) => {
    switch (status) {
      case "running":
        return (
          <Badge
            variant="default"
            className="animate-pulse bg-primary text-primary-foreground gap-1 text-xs"
          >
            <Loader2 className="h-3 w-3 animate-spin" />
            Executing
          </Badge>
        )
      case "completed":
        return (
          <Badge
            variant="secondary"
            className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 gap-1 text-xs"
          >
            <CheckCircle2 className="h-3 w-3" />
            Done
          </Badge>
        )
      case "error":
        return (
          <Badge variant="destructive" className="gap-1 text-xs">
            <AlertCircle className="h-3 w-3" />
            Failed
          </Badge>
        )
      default:
        return (
          <Badge
            variant="outline"
            className="text-muted-foreground border-border/60 text-xs"
          >
            Waiting
          </Badge>
        )
    }
  }

  return (
    <div className="w-full space-y-4">
      {/* Active Pipeline Header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <Cpu className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-semibold tracking-tight text-foreground">
            Multi-Agent Orchestration Pipeline
          </h2>
        </div>
        <div className="flex items-center gap-2">
          {isLoading && activeAgentId ? (
            <span className="flex items-center gap-1.5 text-xs font-medium text-primary">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Active: {AGENT_REGISTRY[activeAgentId].name}
            </span>
          ) : (
            <span className="text-xs text-muted-foreground">
              {agentStates.decisionAgent.status === "completed"
                ? "Pipeline execution completed"
                : "Awaiting input"}
            </span>
          )}
        </div>
      </div>

      {/* Horizontal Interactive Pipeline Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2.5">
        {AGENT_PIPELINE_ORDER.map((agentId, index) => {
          const agent = AGENT_REGISTRY[agentId]
          const state = agentStates[agentId]
          const isCurrentActive = activeAgentId === agentId
          const isSelected = displayedAgentId === agentId
          const Icon = AGENT_ICONS[agentId] || Bot

          return (
            <div key={agentId} className="relative flex items-center">
              <button
                type="button"
                onClick={() => setSelectedAgent(agentId)}
                className={`w-full text-left p-3.5 rounded-xl border transition-all duration-200 cursor-pointer ${
                  isCurrentActive
                    ? "border-primary/80 bg-primary/5 shadow-sm ring-2 ring-primary/20"
                    : isSelected
                      ? "border-border bg-accent/40 shadow-xs"
                      : "border-border/60 bg-card hover:bg-accent/20"
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <div
                      className={`p-1.5 rounded-lg transition-colors ${
                        isCurrentActive
                          ? "bg-primary text-primary-foreground"
                          : state.status === "completed"
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                            : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="text-xs font-mono text-muted-foreground">
                      0{index + 1}
                    </span>
                  </div>
                  {getStatusBadge(state.status)}
                </div>

                <div className="space-y-1">
                  <div className="text-xs font-semibold text-foreground line-clamp-1">
                    {agent.name}
                  </div>
                  <div className="text-[11px] text-muted-foreground line-clamp-1">
                    {agent.role}
                  </div>
                </div>

                {state.durationMs !== undefined && state.durationMs > 0 && (
                  <div className="mt-2.5 pt-2 border-t border-border/40 flex items-center gap-1 text-[10px] text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{(state.durationMs / 1000).toFixed(2)}s</span>
                  </div>
                )}
              </button>

              {/* Arrow separator on desktop */}
              {index < AGENT_PIPELINE_ORDER.length - 1 && (
                <div className="hidden md:flex absolute -right-2 z-10 p-0.5 rounded-full bg-background border border-border/80 text-muted-foreground">
                  <ArrowRight className="h-2.5 w-2.5" />
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Selected / Active Agent Real-Time Stream Inspector */}
      {displayedAgentId && (
        <Card className="border border-border/80 bg-card shadow-xs transition-all overflow-hidden">
          <CardHeader className="py-2.5 px-4 bg-muted/30 border-b border-border/60 flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-primary" />
              <CardTitle className="text-xs font-medium">
                {displayedAgentId === activeAgentId
                  ? `Live Stream: ${AGENT_REGISTRY[displayedAgentId].name}`
                  : `Agent Details: ${AGENT_REGISTRY[displayedAgentId].name}`}
              </CardTitle>
              {displayedAgentData && getStatusBadge(displayedAgentData.status)}
            </div>

            <div className="flex items-center gap-1">
              {displayedAgentData?.output && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-muted-foreground hover:text-foreground"
                  onClick={() => handleCopy(displayedAgentData.output)}
                  title="Copy output"
                >
                  {copied ? (
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground hover:text-foreground"
                onClick={() => setIsInspectorExpanded(!isInspectorExpanded)}
                title={isInspectorExpanded ? "Collapse" : "Expand"}
              >
                {isInspectorExpanded ? (
                  <ChevronUp className="h-3.5 w-3.5" />
                ) : (
                  <ChevronDown className="h-3.5 w-3.5" />
                )}
              </Button>
            </div>
          </CardHeader>

          {isInspectorExpanded && (
            <CardContent className="p-0">
              <ScrollArea className="max-h-56 min-h-24 p-4 text-xs font-mono leading-relaxed text-foreground/90 whitespace-pre-wrap">
                {displayedAgentData?.output ? (
                  <div>
                    {displayedAgentData.output}
                    {displayedAgentData.status === "running" && (
                      <span className="inline-block w-1.5 h-3.5 ml-1 bg-primary animate-pulse align-middle" />
                    )}
                  </div>
                ) : displayedAgentData?.status === "running" ? (
                  <div className="flex items-center gap-2 text-muted-foreground animate-pulse">
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
                    <span>Streaming agent response...</span>
                  </div>
                ) : (
                  <div className="text-muted-foreground italic">
                    No output recorded yet for this agent step.
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          )}
        </Card>
      )}
    </div>
  )
}
