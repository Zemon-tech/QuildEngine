import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo, useEffect, useRef } from "react";
import {
  BrainCircuit,
  Activity,
  Cpu,
  Bot,
  Terminal,
  Database,
  Search,
  Key,
  Layers,
  Settings,
  TrendingUp,
  LineChart,
  Network,
  Clock,
  Sparkles,
  Play,
  Plus,
  RefreshCw,
  Sliders,
  CheckCircle,
  AlertTriangle,
  PlayCircle,
  FileText,
  UserCheck,
  Send,
  SlidersHorizontal,
  ChevronRight,
  DatabaseZap,
  Globe,
  Binary,
  ArrowUpRight,
  Code2,
  BookOpen,
  Mail,
  User,
  ExternalLink,
  Lock,
  Trash2,
  Edit2
} from "lucide-react";
import { PageHeader } from "#/components/admin/page-header";
import { StatCard } from "#/components/admin/stat-card";
import { Button } from "#/components/ui/button";
import { Badge } from "#/components/ui/badge";
import { cn } from "#/lib/utils";

export const Route = createFileRoute("/_admin/ai/")({
  component: AIDashboardPage,
});

type TabId =
  | "overview"
  | "analytics"
  | "usage"
  | "tokens"
  | "models"
  | "agents"
  | "prompts"
  | "knowledge"
  | "rag"
  | "api"
  | "jobs"
  | "timeline"
  | "settings";

function AIDashboardPage() {
  const [activeTab, setActiveTab] = useState<TabId>("overview");

  // Tab definitions
  const tabs = [
    { id: "overview" as TabId, label: "AI Overview", icon: Sparkles, color: "text-amber-500 bg-amber-500/10" },
    { id: "analytics" as TabId, label: "AI Analytics", icon: LineChart, color: "text-blue-500 bg-blue-500/10" },
    { id: "usage" as TabId, label: "AI Usage", icon: Activity, color: "text-emerald-500 bg-emerald-500/10" },
    { id: "tokens" as TabId, label: "Token Usage", icon: Binary, color: "text-violet-500 bg-violet-500/10" },
    { id: "models" as TabId, label: "Model Management", icon: Cpu, color: "text-purple-500 bg-purple-500/10" },
    { id: "agents" as TabId, label: "AI Agents", icon: Bot, color: "text-indigo-500 bg-indigo-500/10" },
    { id: "prompts" as TabId, label: "Prompt Management", icon: Terminal, color: "text-rose-500 bg-rose-500/10" },
    { id: "knowledge" as TabId, label: "Knowledge Base", icon: Database, color: "text-cyan-500 bg-cyan-500/10" },
    { id: "rag" as TabId, label: "RAG Management", icon: Network, color: "text-teal-500 bg-teal-500/10" },
    { id: "api" as TabId, label: "API Usage", icon: Key, color: "text-sky-500 bg-sky-500/10" },
    { id: "jobs" as TabId, label: "Background Jobs", icon: Layers, color: "text-orange-500 bg-orange-500/10" },
    { id: "timeline" as TabId, label: "AI Activity Timeline", icon: Clock, color: "text-pink-500 bg-pink-500/10" },
    { id: "settings" as TabId, label: "AI Settings", icon: Settings, color: "text-zinc-500 bg-zinc-500/10" },
  ];

  return (
    <div className="p-6 w-full pb-16">
      <PageHeader
        title="AI Dashboard"
        description="Comprehensive control, optimization, and auditing workspace for Quild platform AI systems."
        icon={BrainCircuit}
        breadcrumbs={[{ label: "Admin" }, { label: "AI Dashboard" }]}
      />

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6 mt-6">
        {/* Navigation Sidebar (Vertical tabs) */}
        <div className="xl:col-span-1 flex flex-col gap-1.5 island-shell rounded-xl p-3 h-fit">
          <div className="px-2.5 pb-2 border-b border-[var(--sb-border)]">
            <span className="text-[10px] font-bold tracking-wider uppercase" style={{ color: "var(--sb-ink-dim)" }}>
              Dashboard Sections
            </span>
          </div>
          <div className="flex flex-col gap-1 overflow-y-auto max-h-[70vh] scrollbar-none">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer active:scale-98 text-left",
                    active
                      ? "bg-[color-mix(in_oklab,var(--sb-ink)_8%,transparent)] text-[var(--sb-ink)] font-bold shadow-xs"
                      : "text-[var(--sb-ink-muted)] hover:bg-[color-mix(in_oklab,var(--sb-ink)_3%,transparent)] hover:text-[var(--sb-ink)]"
                  )}
                >
                  <span className={cn("p-1 rounded-md", tab.color)}>
                    <Icon size={13} />
                  </span>
                  <span className="flex-1 truncate">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Viewport */}
        <div className="xl:col-span-4 flex flex-col min-h-[60vh]">
          {activeTab === "overview" && <OverviewTab />}
          {activeTab === "analytics" && <AnalyticsTab />}
          {activeTab === "usage" && <UsageTab />}
          {activeTab === "tokens" && <TokensTab />}
          {activeTab === "models" && <ModelsTab />}
          {activeTab === "agents" && <AgentsTab />}
          {activeTab === "prompts" && <PromptsTab />}
          {activeTab === "knowledge" && <KnowledgeTab />}
          {activeTab === "rag" && <RAGTab />}
          {activeTab === "api" && <APITab />}
          {activeTab === "jobs" && <JobsTab />}
          {activeTab === "timeline" && <TimelineTab />}
          {activeTab === "settings" && <SettingsTab />}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. OVERVIEW TAB
// ─────────────────────────────────────────────────────────────────────────────
function OverviewTab() {
  const stats = {
    pipelineHealth: "99.85%",
    avgLatency: "312 ms",
    totalCalls: "48,291",
    activeAgents: "8 running",
    costSaved: "$342.90"
  };

  const agentsList = [
    { name: "DSA Code Reviewer", trigger: "On submission", status: "idle", usage: "24.1k runs" },
    { name: "Course Outline Generator", trigger: "On demand", status: "running", usage: "11.2k runs" },
    { name: "Semantic RAG Search Optimizer", trigger: "Cron (hourly)", status: "idle", usage: "9.4k runs" },
    { name: "Customer Support Assistant", trigger: "Chat initiated", status: "idle", usage: "3.4k runs" },
  ];

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-200">
      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-4">
        <StatCard title="Pipeline Health" value={stats.pipelineHealth} delta="Healthy" deltaDirection="up" icon={CheckCircle} />
        <StatCard title="Avg. Response Time" value={stats.avgLatency} delta="Last 1h" deltaDirection="up" icon={Clock} />
        <StatCard title="Total Completion Calls" value={stats.totalCalls} delta="+14.2% vs. yesterday" deltaDirection="up" icon={BrainCircuit} />
        <StatCard title="Active AI Agents" value={stats.activeAgents} delta="0 warnings" deltaDirection="up" icon={Bot} />
        <StatCard title="Est. Provider Costs Saved" value={stats.costSaved} delta="Cache hits" deltaDirection="up" icon={TrendingUp} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Agents list */}
        <div className="island-shell rounded-xl p-5 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--sb-ink-dim)" }}>
              Active AI Agents
            </h2>
            <Badge variant="secondary" className="text-[10px] bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/15">
              All systems nominal
            </Badge>
          </div>
          <div className="flex flex-col gap-3">
            {agentsList.map((agent) => (
              <div
                key={agent.name}
                className="flex items-center justify-between p-3 rounded-lg border border-[var(--sb-border)]"
                style={{ background: "color-mix(in oklab, var(--sb-ink) 2%, transparent)" }}
              >
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-semibold" style={{ color: "var(--sb-ink)" }}>{agent.name}</span>
                  <span className="text-[10px] mt-0.5" style={{ color: "var(--sb-ink-dim)" }}>Trigger: {agent.trigger}</span>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-[10px] font-semibold" style={{ color: "var(--sb-ink-muted)" }}>{agent.usage}</span>
                  <Badge
                    className={cn(
                      "text-[9px] uppercase tracking-wider font-bold py-0.5 px-1.5",
                      agent.status === "running" ? "bg-amber-500/15 text-amber-500" : "bg-[color-mix(in_oklab,var(--sb-ink)_8%,transparent)] text-[var(--sb-ink-muted)]"
                    )}
                  >
                    {agent.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Model breakdown progress bars */}
        <div className="island-shell rounded-xl p-5 flex flex-col">
          <h2 className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: "var(--sb-ink-dim)" }}>
            Provider & Model Routing Share
          </h2>
          <div className="flex flex-col gap-4 flex-1 justify-center">
            {/* OpenAI */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span style={{ color: "var(--sb-ink)" }}>OpenAI (gpt-4o, gpt-4o-mini)</span>
                <span style={{ color: "var(--sb-accent)" }}>62%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-[var(--sb-border)] overflow-hidden">
                <div className="h-full bg-[var(--sb-accent)] rounded-full" style={{ width: "62%" }} />
              </div>
            </div>

            {/* Anthropic */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span style={{ color: "var(--sb-ink)" }}>Anthropic (claude-3-5-sonnet)</span>
                <span className="text-blue-500">24%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-[var(--sb-border)] overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: "24%" }} />
              </div>
            </div>

            {/* Google Gemini */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span style={{ color: "var(--sb-ink)" }}>Google (gemini-1.5-pro)</span>
                <span className="text-emerald-500">14%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-[var(--sb-border)] overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: "14%" }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. ANALYTICS TAB
// ─────────────────────────────────────────────────────────────────────────────
function AnalyticsTab() {
  const [flushed, setFlushed] = useState(false);

  const handleFlushCache = () => {
    setFlushed(true);
    setTimeout(() => setFlushed(false), 2000);
  };

  return (
    <div className="island-shell rounded-xl p-6 flex flex-col gap-6 animate-in fade-in duration-200">
      <div className="flex items-center justify-between border-b pb-3 border-[var(--sb-border)]">
        <div className="flex flex-col">
          <h2 className="text-sm font-bold" style={{ color: "var(--sb-ink)" }}>System Performance Analytics</h2>
          <span className="text-[11px]" style={{ color: "var(--sb-ink-dim)" }}>Response speeds, caching efficiencies, and error metrics.</span>
        </div>
        <Button onClick={handleFlushCache} size="xs" variant="outline" className="text-xs">
          <RefreshCw size={12} className={cn("mr-1.5", flushed && "animate-spin")} />
          {flushed ? "Cache Flushed" : "Flush Completion Cache"}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Latency card */}
        <div className="flex flex-col border border-[var(--sb-border)] p-4 rounded-lg">
          <span className="text-xs font-semibold mb-3 uppercase tracking-wider" style={{ color: "var(--sb-ink-muted)" }}>
            Average Latency by LLM
          </span>
          <div className="flex flex-col gap-3">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span>GPT-4o</span>
                <span>240ms</span>
              </div>
              <div className="h-1.5 w-full bg-[var(--sb-border)] rounded-full overflow-hidden">
                <div className="h-full bg-[var(--sb-accent)]" style={{ width: "48%" }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span>Claude 3.5 Sonnet</span>
                <span>390ms</span>
              </div>
              <div className="h-1.5 w-full bg-[var(--sb-border)] rounded-full overflow-hidden">
                <div className="h-full bg-blue-500" style={{ width: "78%" }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span>Gemini 1.5 Pro</span>
                <span>310ms</span>
              </div>
              <div className="h-1.5 w-full bg-[var(--sb-border)] rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500" style={{ width: "62%" }} />
              </div>
            </div>
          </div>
        </div>

        {/* Errors card */}
        <div className="flex flex-col border border-[var(--sb-border)] p-4 rounded-lg">
          <span className="text-xs font-semibold mb-3 uppercase tracking-wider" style={{ color: "var(--sb-ink-muted)" }}>
            Error Rates (Last 24h)
          </span>
          <div className="flex flex-col gap-3">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span>GPT-4o</span>
                <span>0.05%</span>
              </div>
              <div className="h-1.5 w-full bg-[var(--sb-border)] rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500" style={{ width: "5%" }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span>Claude 3.5 Sonnet</span>
                <span>0.12%</span>
              </div>
              <div className="h-1.5 w-full bg-[var(--sb-border)] rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500" style={{ width: "12%" }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span>Gemini 1.5 Pro</span>
                <span>0.08%</span>
              </div>
              <div className="h-1.5 w-full bg-[var(--sb-border)] rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500" style={{ width: "8%" }} />
              </div>
            </div>
          </div>
        </div>

        {/* Cache card */}
        <div className="flex flex-col border border-[var(--sb-border)] p-4 rounded-lg justify-between">
          <div>
            <span className="text-xs font-semibold mb-1 block uppercase tracking-wider" style={{ color: "var(--sb-ink-muted)" }}>
              Response Cache Hit Rate
            </span>
            <span className="text-3xl font-extrabold text-[var(--sb-accent)] block mt-2">34.2%</span>
            <span className="text-[10px] mt-2 block leading-relaxed" style={{ color: "var(--sb-ink-dim)" }}>
              34.2% of completions are answered instantly via cache storage, reducing cost and latency to zero.
            </span>
          </div>
          <div className="text-[10px] font-semibold border-t pt-3 flex justify-between" style={{ color: "var(--sb-ink-muted)", borderColor: "var(--sb-border)" }}>
            <span>Total cached queries: 16,512</span>
            <span>Total savings: $421.40</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. USAGE TAB
// ─────────────────────────────────────────────────────────────────────────────
function UsageTab() {
  const usageData = [
    { feature: "DSA Evaluator", icon: Code2, count: "24,192 runs", cost: "$120.96", share: "50%" },
    { feature: "LMS Curriculum Maker", icon: BookOpen, count: "11,203 runs", cost: "$89.62", share: "23%" },
    { feature: "Semantic Vector Search", icon: Search, count: "9,410 runs", cost: "$9.41", share: "20%" },
    { feature: "Customer Support LiveChat", icon: Mail, count: "3,486 runs", cost: "$10.45", share: "7%" },
  ];

  return (
    <div className="island-shell rounded-xl p-6 flex flex-col gap-6 animate-in fade-in duration-200">
      <div className="flex flex-col border-b pb-3 border-[var(--sb-border)]">
        <h2 className="text-sm font-bold" style={{ color: "var(--sb-ink)" }}>Completion Volume by Feature</h2>
        <span className="text-[11px]" style={{ color: "var(--sb-ink-dim)" }}>Breakdown of completion prompts sent from platform functionalities.</span>
      </div>

      <div className="flex flex-col gap-3">
        {usageData.map((data) => {
          const Icon = data.icon;
          return (
            <div
              key={data.feature}
              className="flex items-center justify-between p-4 rounded-xl border border-[var(--sb-border)]"
              style={{ background: "color-mix(in oklab, var(--sb-ink) 2%, transparent)" }}
            >
              <div className="flex items-center gap-3">
                <span className="p-2 rounded-lg bg-[var(--sb-bg-hover)] text-[var(--sb-ink-muted)] shrink-0">
                  <Icon size={14} />
                </span>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold" style={{ color: "var(--sb-ink)" }}>{data.feature}</span>
                  <span className="text-[10px]" style={{ color: "var(--sb-ink-dim)" }}>{data.count}</span>
                </div>
              </div>

              <div className="flex items-center gap-6 text-right">
                <div className="flex flex-col">
                  <span className="text-xs font-semibold" style={{ color: "var(--sb-ink)" }}>{data.cost}</span>
                  <span className="text-[10px]" style={{ color: "var(--sb-ink-dim)" }}>Est. cost</span>
                </div>
                <div className="w-12 text-center text-xs font-bold text-[var(--sb-accent)] bg-[var(--sb-pill)] py-1 rounded-md shrink-0">
                  {data.share}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. TOKEN USAGE TAB
// ─────────────────────────────────────────────────────────────────────────────
function TokensTab() {
  const providerTokens = [
    { provider: "OpenAI", input: "142.1M", output: "48.9M", inputCost: "$355.25", outputCost: "$489.00", totalCost: "$844.25" },
    { provider: "Anthropic", input: "34.8M", output: "12.2M", inputCost: "$104.40", outputCost: "$183.00", totalCost: "$287.40" },
    { provider: "Google Gemini", input: "95.1M", output: "22.0M", inputCost: "$7.13", outputCost: "$16.50", totalCost: "$23.63" },
  ];

  return (
    <div className="island-shell rounded-xl p-6 flex flex-col gap-6 animate-in fade-in duration-200">
      <div className="flex flex-col border-b pb-3 border-[var(--sb-border)]">
        <h2 className="text-sm font-bold" style={{ color: "var(--sb-ink)" }}>Token Breakdown & Provider Costing</h2>
        <span className="text-[11px]" style={{ color: "var(--sb-ink-dim)" }}>Aggregate token counts mapped to corresponding pricing models (Current billing cycle).</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left border-collapse">
          <thead>
            <tr className="border-b" style={{ borderColor: "var(--sb-border)", color: "var(--sb-ink-muted)" }}>
              <th className="pb-3 font-semibold uppercase tracking-wider">Provider</th>
              <th className="pb-3 font-semibold uppercase tracking-wider">Input Tokens</th>
              <th className="pb-3 font-semibold uppercase tracking-wider">Output Tokens</th>
              <th className="pb-3 font-semibold uppercase tracking-wider">Input Cost</th>
              <th className="pb-3 font-semibold uppercase tracking-wider">Output Cost</th>
              <th className="pb-3 font-semibold uppercase tracking-wider text-right">Total Billing</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--sb-border)]">
            {providerTokens.map((t) => (
              <tr key={t.provider} style={{ color: "var(--sb-ink)" }}>
                <td className="py-3.5 font-semibold">{t.provider}</td>
                <td className="py-3.5" style={{ color: "var(--sb-ink-muted)" }}>{t.input}</td>
                <td className="py-3.5" style={{ color: "var(--sb-ink-muted)" }}>{t.output}</td>
                <td className="py-3.5" style={{ color: "var(--sb-ink-dim)" }}>{t.inputCost}</td>
                <td className="py-3.5" style={{ color: "var(--sb-ink-dim)" }}>{t.outputCost}</td>
                <td className="py-3.5 text-right font-bold text-[var(--sb-accent)]">{t.totalCost}</td>
              </tr>
            ))}
            <tr className="font-bold border-t-2" style={{ color: "var(--sb-ink)", borderColor: "var(--sb-border)" }}>
              <td className="py-4">Combined Sum</td>
              <td className="py-4">272.0M</td>
              <td className="py-4">83.1M</td>
              <td className="py-4">$466.78</td>
              <td className="py-4">$688.50</td>
              <td className="py-4 text-right text-base text-[var(--sb-accent)]">$1,155.28</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. MODEL MANAGEMENT TAB
// ─────────────────────────────────────────────────────────────────────────────
function ModelsTab() {
  const [routingType, setRoutingType] = useState<"cost" | "latency" | "static">("cost");
  const [success, setSuccess] = useState(false);

  const models = [
    { name: "gpt-4o", provider: "OpenAI", status: "Active", latency: "240ms", reliability: "99.92%", type: "Primary completion" },
    { name: "claude-3-5-sonnet", provider: "Anthropic", status: "Active", latency: "390ms", reliability: "99.88%", type: "Complex reasoning fallback" },
    { name: "gemini-1.5-pro", provider: "Google", status: "Active", latency: "310ms", reliability: "99.95%", type: "Long context evaluation" },
    { name: "gpt-4o-mini", provider: "OpenAI", status: "Active", latency: "160ms", reliability: "99.98%", type: "Lightweight utility tasks" },
  ];

  const handleSaveRouter = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2000);
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-200">
      {/* Active Model Configurations */}
      <div className="island-shell rounded-xl p-5 flex flex-col">
        <h2 className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: "var(--sb-ink-dim)" }}>
          Active Completion Models
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b" style={{ borderColor: "var(--sb-border)", color: "var(--sb-ink-muted)" }}>
                <th className="pb-2 font-semibold">Model Name</th>
                <th className="pb-2 font-semibold">Provider</th>
                <th className="pb-2 font-semibold">P90 Latency</th>
                <th className="pb-2 font-semibold">Reliability</th>
                <th className="pb-2 font-semibold">Assigned Task</th>
                <th className="pb-2 font-semibold text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--sb-border)]">
              {models.map((m) => (
                <tr key={m.name} style={{ color: "var(--sb-ink)" }}>
                  <td className="py-3 font-semibold">{m.name}</td>
                  <td className="py-3 text-[var(--sb-ink-muted)]">{m.provider}</td>
                  <td className="py-3 text-[var(--sb-ink-muted)]">{m.latency}</td>
                  <td className="py-3 text-emerald-500 font-semibold">{m.reliability}</td>
                  <td className="py-3 text-[var(--sb-ink-dim)]">{m.type}</td>
                  <td className="py-3 text-right">
                    <Badge className="bg-emerald-500/10 text-emerald-500 border-none font-bold py-0.5 text-[9px]">
                      {m.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Model Router Rules */}
      <div className="island-shell rounded-xl p-5 flex flex-col gap-4">
        <h2 className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--sb-ink-dim)" }}>
          Global Model Router Policy
        </h2>

        <form onSubmit={handleSaveRouter} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { id: "cost", label: "Minimize Cost", desc: "Routes automatically to the cheapest capable active model (e.g. gpt-4o-mini)." },
              { id: "latency", label: "Minimize Latency", desc: "Routes dynamically to the model demonstrating the lowest current round-trip time." },
              { id: "static", label: "Static Fallback", desc: "Follows a hardcoded chain of fallbacks (GPT-4o -> Claude -> Gemini)." }
            ].map((policy) => (
              <label
                key={policy.id}
                className={cn(
                  "flex flex-col p-4 rounded-xl border transition-all cursor-pointer",
                  routingType === policy.id
                    ? "border-[var(--sb-accent)] bg-[color-mix(in_oklab,var(--sb-ink)_3%,transparent)]"
                    : "border-[var(--sb-border)] hover:bg-[color-mix(in_oklab,var(--sb-ink)_1.5%,transparent)]"
                )}
              >
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="routingPolicy"
                    checked={routingType === policy.id}
                    onChange={() => setRoutingType(policy.id as any)}
                    className="cursor-pointer size-3.5 accent-[var(--sb-accent)]"
                  />
                  <span className="text-xs font-bold" style={{ color: "var(--sb-ink)" }}>{policy.label}</span>
                </div>
                <p className="text-[10px] mt-2 leading-relaxed" style={{ color: "var(--sb-ink-dim)" }}>
                  {policy.desc}
                </p>
              </label>
            ))}
          </div>

          <div className="flex items-center justify-end gap-3 mt-2 border-t pt-4 border-[var(--sb-border)]">
            {success && (
              <span className="text-xs text-emerald-500 font-semibold animate-in fade-in duration-200">
                Router policy saved successfully
              </span>
            )}
            <Button type="submit" size="xs" className="w-24 active:scale-95">
              Save Policy
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. AI AGENTS TAB
// ─────────────────────────────────────────────────────────────────────────────
function AgentsTab() {
  const [selectedAgent, setSelectedAgent] = useState("review");
  const [logs, setLogs] = useState<string[]>([]);
  const [running, setRunning] = useState(false);
  const logContainerRef = useRef<HTMLDivElement>(null);

  const agents = {
    review: {
      name: "DSA Code Reviewer",
      desc: "Autonomously audits DSA submissions, evaluates complexity, and structures feedback.",
      promptVer: "v2.1",
      tools: ["Code Parser", "Big O Classifier", "Memory Leak Finder"]
    },
    course: {
      name: "Course Outline Generator",
      desc: "Generates custom course curriculum, lesson outlines, and assessment guides.",
      promptVer: "v1.4",
      tools: ["Syllabus Extractor", "LMS Template Compiler", "Web Searcher"]
    },
    rag: {
      name: "RAG Optimizer Agent",
      desc: "Optimizes indexing of new PDF manuals, checks semantic embeddings, and creates chunks.",
      promptVer: "v1.0",
      tools: ["Embedding Engine", "Chunk Splitter", "Vector DB Connector"]
    }
  };

  const currentAgent = agents[selectedAgent as keyof typeof agents];

  const runAgentSimulator = () => {
    if (running) return;
    setRunning(true);
    setLogs(["[SYSTEM] Initiating agent execution...", `[SYSTEM] Agent ID: ${selectedAgent}`, `[SYSTEM] Active prompt version: ${currentAgent.promptVer}`]);

    let step = 0;
    const simSteps = [
      `[LOAD] Fetching agent tools: ${currentAgent.tools.join(", ")}`,
      "[INFO] Querying active vector store context...",
      "[INFO] Generating agent completion matrix...",
      "[SUCCESS] Code compiled and analyzed in 340ms.",
      "[COMPLETION] Complexity: O(N log N) time, O(N) space complexity.",
      "[COMPLETION] Feedbacks structured and sent to database.",
      "[SYSTEM] Execution complete. Agent returned with exit code 0."
    ];

    const timer = setInterval(() => {
      if (step < simSteps.length) {
        setLogs((prev) => [...prev, simSteps[step]]);
        step++;
      } else {
        clearInterval(timer);
        setRunning(false);
      }
    }, 800);
  };

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="island-shell rounded-xl p-6 flex flex-col gap-6 animate-in fade-in duration-200">
      <div className="flex flex-col border-b pb-3 border-[var(--sb-border)]">
        <h2 className="text-sm font-bold" style={{ color: "var(--sb-ink)" }}>AI Agents Console</h2>
        <span className="text-[11px]" style={{ color: "var(--sb-ink-dim)" }}>Run, test, and trace autonomous background agent executors.</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Select Agent */}
        <div className="lg:col-span-1 flex flex-col gap-2.5">
          {Object.keys(agents).map((key) => {
            const ag = agents[key as keyof typeof agents];
            const active = selectedAgent === key;
            return (
              <button
                key={key}
                onClick={() => {
                  setSelectedAgent(key);
                  setLogs([]);
                }}
                className={cn(
                  "flex flex-col p-4 rounded-xl border transition-all text-left cursor-pointer",
                  active
                    ? "border-[var(--sb-accent)] bg-[color-mix(in_oklab,var(--sb-ink)_3%,transparent)]"
                    : "border-[var(--sb-border)] hover:bg-[color-mix(in_oklab,var(--sb-ink)_1.5%,transparent)]"
                )}
              >
                <span className="text-xs font-bold" style={{ color: "var(--sb-ink)" }}>{ag.name}</span>
                <span className="text-[10px] mt-1 line-clamp-2" style={{ color: "var(--sb-ink-dim)" }}>{ag.desc}</span>
              </button>
            );
          })}
        </div>

        {/* Right Side: Agent Details & Execution Console */}
        <div className="lg:col-span-2 flex flex-col gap-4 border border-[var(--sb-border)] p-4 rounded-xl">
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <span className="text-xs font-bold" style={{ color: "var(--sb-ink)" }}>{currentAgent.name} Config</span>
              <span className="text-[10px]" style={{ color: "var(--sb-ink-dim)" }}>Active Prompt: {currentAgent.promptVer}</span>
            </div>
            <Button
              onClick={runAgentSimulator}
              disabled={running}
              size="xs"
              className="w-28 text-xs font-bold active:scale-95 flex items-center justify-center gap-1.5"
            >
              <Play size={11} />
              {running ? "Simulating..." : "Trigger Run"}
            </Button>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {currentAgent.tools.map((t) => (
              <Badge key={t} variant="outline" className="text-[9px] font-semibold text-[var(--sb-ink-muted)] bg-[var(--sb-bg-hover)] border-[var(--sb-border)]">
                Tool: {t}
              </Badge>
            ))}
          </div>

          {/* Console Output */}
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--sb-ink-dim)" }}>
              Streaming Logs
            </span>
            <div
              ref={logContainerRef}
              className="bg-black/95 dark:bg-black/60 text-zinc-300 p-4 rounded-lg font-mono text-[10px] h-48 overflow-y-auto leading-relaxed border border-zinc-800"
            >
              {logs.length === 0 ? (
                <span className="text-zinc-600 italic">Click "Trigger Run" above to stream agent logs...</span>
              ) : (
                logs.map((log, index) => (
                  <div
                    key={index}
                    className={cn(
                      log.startsWith("[SYSTEM]") && "text-blue-400 font-bold",
                      log.startsWith("[SUCCESS]") && "text-emerald-400 font-bold",
                      log.startsWith("[COMPLETION]") && "text-purple-400",
                      log.startsWith("[LOAD]") && "text-zinc-400"
                    )}
                  >
                    {log}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. PROMPT MANAGEMENT TAB
// ─────────────────────────────────────────────────────────────────────────────
function PromptsTab() {
  const [selectedPrompt, setSelectedPrompt] = useState("dsa_eval");
  const [promptText, setPromptText] = useState(
    "You are an expert DSA evaluation bot. Critique the following code submission for big O efficiency, potential memory leaks, and correctness."
  );
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const prompts = {
    dsa_eval: {
      name: "dsa_evaluator_v2",
      text: "You are an expert DSA evaluation bot. Critique the following code submission for big O efficiency, potential memory leaks, and correctness.",
      vars: ["code", "problem_statement", "language"]
    },
    course_gen: {
      name: "course_outline_generator_v1",
      text: "Create a fully fleshed out course syllabus in JSON matching the specified technical skill parameters and total week count.",
      vars: ["skill_name", "skill_difficulty", "weeks_count"]
    },
    chatbot: {
      name: "chat_assistant_v3",
      text: "You are Quild's AI learning assistant. Answer platform-related or course-related questions politely using the context provided.",
      vars: ["context", "user_query", "chat_history"]
    }
  };

  const handlePromptChange = (key: string) => {
    setSelectedPrompt(key);
    setPromptText(prompts[key as keyof typeof prompts].text);
  };

  const handleSavePrompt = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    }, 1000);
  };

  return (
    <div className="island-shell rounded-xl p-6 flex flex-col gap-6 animate-in fade-in duration-200">
      <div className="flex flex-col border-b pb-3 border-[var(--sb-border)]">
        <h2 className="text-sm font-bold" style={{ color: "var(--sb-ink)" }}>System Prompts Playground</h2>
        <span className="text-[11px]" style={{ color: "var(--sb-ink-dim)" }}>Draft, version, and manage system prompts used in active completion loops.</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Prompts List */}
        <div className="lg:col-span-1 flex flex-col gap-2.5">
          {Object.keys(prompts).map((key) => {
            const pr = prompts[key as keyof typeof prompts];
            const active = selectedPrompt === key;
            return (
              <button
                key={key}
                onClick={() => handlePromptChange(key)}
                className={cn(
                  "flex items-center justify-between p-3 rounded-lg border transition-all text-left cursor-pointer",
                  active
                    ? "border-[var(--sb-accent)] bg-[color-mix(in_oklab,var(--sb-ink)_3%,transparent)]"
                    : "border-[var(--sb-border)] hover:bg-[color-mix(in_oklab,var(--sb-ink)_1.5%,transparent)]"
                )}
              >
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-bold truncate" style={{ color: "var(--sb-ink)" }}>{pr.name}</span>
                  <span className="text-[10px] mt-0.5" style={{ color: "var(--sb-ink-dim)" }}>Variables: {pr.vars.join(", ")}</span>
                </div>
                <ChevronRight size={12} style={{ color: "var(--sb-ink-dim)" }} />
              </button>
            );
          })}
        </div>

        {/* Right Side: Edit Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSavePrompt} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="promptTextarea" className="text-xs font-bold" style={{ color: "var(--sb-ink-muted)" }}>
                Prompt Template Body
              </label>
              <textarea
                id="promptTextarea"
                value={promptText}
                onChange={(e) => setPromptText(e.target.value)}
                required
                rows={5}
                className={cn(
                  "w-full rounded-[10px] p-3 text-xs outline-none transition-all duration-150 resize-none leading-relaxed",
                  "focus-visible:ring-2 focus-visible:ring-[var(--sb-accent)]/30",
                )}
                style={{
                  background: "color-mix(in oklab, var(--sb-ink) 4%, transparent)",
                  border: "1px solid var(--sb-border)",
                  color: "var(--sb-ink)",
                }}
              />
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--sb-ink-dim)" }}>
                Prompt Input Parameters
              </span>
              <div className="flex flex-wrap gap-1.5">
                {prompts[selectedPrompt as keyof typeof prompts].vars.map((v) => (
                  <Badge key={v} variant="outline" className="text-[9px] font-mono font-bold text-rose-500 bg-rose-500/5 border-rose-500/20">
                    {"{{"} {v} {"}}"}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 mt-2 border-t pt-4 border-[var(--sb-border)]">
              {success && (
                <span className="text-xs text-emerald-500 font-semibold animate-in fade-in duration-200">
                  Prompt updated to v2.2
                </span>
              )}
              <Button type="submit" disabled={saving} size="xs" className="w-28 active:scale-95">
                {saving ? "Saving..." : "Save Template"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 8. KNOWLEDGE BASE TAB
// ─────────────────────────────────────────────────────────────────────────────
function KnowledgeTab() {
  const [indexing, setIndexing] = useState(false);
  const [success, setSuccess] = useState(false);

  const docs = [
    { title: "DSA_Complexity_Guide.pdf", type: "PDF manual", size: "2.4 MB", chunks: "148 chunks", date: "Jun 12, 2026" },
    { title: "Syllabus_Parameters_Schema.json", type: "JSON spec", size: "140 KB", chunks: "12 chunks", date: "May 20, 2026" },
    { title: "Platform_General_QA.txt", type: "Text documentation", size: "82 KB", chunks: "48 chunks", date: "Apr 14, 2026" },
  ];

  const startIndexingSimulation = () => {
    if (indexing) return;
    setIndexing(true);
    setTimeout(() => {
      setIndexing(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    }, 2500);
  };

  return (
    <div className="island-shell rounded-xl p-6 flex flex-col gap-6 animate-in fade-in duration-200">
      <div className="flex items-center justify-between border-b pb-3 border-[var(--sb-border)]">
        <div className="flex flex-col">
          <h2 className="text-sm font-bold" style={{ color: "var(--sb-ink)" }}>RAG Knowledge Base</h2>
          <span className="text-[11px]" style={{ color: "var(--sb-ink-dim)" }}>Manage raw documents converted into semantic vector index embeddings.</span>
        </div>
        <Button onClick={startIndexingSimulation} disabled={indexing} size="xs" className="text-xs w-36">
          <DatabaseZap size={12} className={cn("mr-1.5", indexing && "animate-pulse")} />
          {indexing ? "Vectorizing..." : "Index New Document"}
        </Button>
      </div>

      {success && (
        <div
          className="p-3 text-xs rounded-xl flex items-center gap-2 border animate-in slide-in-from-top-3 duration-250"
          style={{
            background: "color-mix(in oklab, var(--lagoon) 10%, transparent)",
            color: "var(--lagoon)",
            borderColor: "color-mix(in oklab, var(--lagoon) 20%, transparent)",
          }}
        >
          <CheckCircle size={14} />
          New document successfully processed, split into 34 chunks, and embedded in Pinecone.
        </div>
      )}

      {/* Index statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="border border-[var(--sb-border)] p-4 rounded-xl flex flex-col justify-center">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--sb-ink-muted)]">Total Embedded Chunks</span>
          <span className="text-2xl font-bold mt-1 text-[var(--sb-ink)]">14,821 chunks</span>
        </div>
        <div className="border border-[var(--sb-border)] p-4 rounded-xl flex flex-col justify-center">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--sb-ink-muted)]">Embedding Model</span>
          <span className="text-sm font-semibold mt-1 text-[var(--sb-ink)]">text-embedding-3-small (1536 dim)</span>
        </div>
        <div className="border border-[var(--sb-border)] p-4 rounded-xl flex flex-col justify-center">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--sb-ink-muted)]">Index Density</span>
          <span className="text-sm font-semibold mt-1 text-[var(--sb-ink)]">3 files • 15.2 MB indexed</span>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--sb-ink-dim)" }}>
          Indexed Sources
        </span>
        {docs.map((doc) => (
          <div
            key={doc.title}
            className="flex items-center justify-between p-3 rounded-lg border border-[var(--sb-border)]"
            style={{ background: "color-mix(in oklab, var(--sb-ink) 2%, transparent)" }}
          >
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-semibold truncate" style={{ color: "var(--sb-ink)" }}>{doc.title}</span>
              <span className="text-[10px] mt-0.5" style={{ color: "var(--sb-ink-dim)" }}>{doc.type} • {doc.size}</span>
            </div>
            <div className="flex items-center gap-4 shrink-0">
              <span className="text-[10px] font-bold text-[var(--sb-accent)] bg-[var(--sb-pill)] px-2 py-0.5 rounded">
                {doc.chunks}
              </span>
              <span className="text-[10px]" style={{ color: "var(--sb-ink-dim)" }}>{doc.date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 9. RAG MANAGEMENT TAB
// ─────────────────────────────────────────────────────────────────────────────
function RAGTab() {
  const [query, setQuery] = useState("Explain time complexity of binary search");
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  const handleRAGSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;
    setSearching(true);

    setTimeout(() => {
      setSearching(false);
      setResults([
        {
          id: "chunk_841",
          score: "0.892 (Cosine similarity)",
          source: "DSA_Complexity_Guide.pdf#page=12",
          text: "Binary search operates by halves, dividing the searchable segment in two at each step. This gives it a recurrence relationship of T(N) = T(N/2) + O(1), resolving directly to O(log N) runtime in worst-case scenarios."
        },
        {
          id: "chunk_1204",
          score: "0.781 (Cosine similarity)",
          source: "Platform_General_QA.txt#line=41",
          text: "Logarithmic time complexities like O(log N) are highly efficient because the operations count grows extremely slowly relative to input size."
        }
      ]);
    }, 1000);
  };

  return (
    <div className="island-shell rounded-xl p-6 flex flex-col gap-6 animate-in fade-in duration-200">
      <div className="flex flex-col border-b pb-3 border-[var(--sb-border)]">
        <h2 className="text-sm font-bold" style={{ color: "var(--sb-ink)" }}>RAG Retrieval Simulator</h2>
        <span className="text-[11px]" style={{ color: "var(--sb-ink-dim)" }}>Simulate vector database lookups and preview exact chunk context retrieved for completion prompts.</span>
      </div>

      {/* Vector Store statuses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border border-[var(--sb-border)] p-3 rounded-lg flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs font-bold" style={{ color: "var(--sb-ink)" }}>Pinecone DB</span>
            <span className="text-[10px]" style={{ color: "var(--sb-ink-dim)" }}>Namespace: quild-lms-prod</span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="size-2 rounded-full bg-emerald-500" />
            <span className="text-[10px] font-semibold text-emerald-500">Connected (12ms ping)</span>
          </div>
        </div>

        <div className="border border-[var(--sb-border)] p-3 rounded-lg flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs font-bold" style={{ color: "var(--sb-ink)" }}>Qdrant DB</span>
            <span className="text-[10px]" style={{ color: "var(--sb-ink-dim)" }}>Collection: local-sandbox</span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="size-2 rounded-full bg-emerald-500" />
            <span className="text-[10px] font-semibold text-emerald-500">Connected (8ms ping)</span>
          </div>
        </div>
      </div>

      {/* Search form */}
      <form onSubmit={handleRAGSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "var(--sb-ink-dim)" }} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            required
            placeholder="Type a query to search vector database..."
            className={cn(
              "w-full rounded-[10px] pl-9 pr-3 py-2 text-xs outline-none transition-all duration-150",
              "focus-visible:ring-2 focus-visible:ring-[var(--sb-accent)]/30",
            )}
            style={{
              background: "color-mix(in oklab, var(--sb-ink) 4%, transparent)",
              border: "1px solid var(--sb-border)",
              color: "var(--sb-ink)",
            }}
          />
        </div>
        <Button type="submit" disabled={searching} size="xs" className="w-28 text-xs font-bold active:scale-95">
          {searching ? "Retrieving..." : "Query Index"}
        </Button>
      </form>

      {/* RAG search results output */}
      <div className="flex flex-col gap-3">
        <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--sb-ink-dim)" }}>
          Retrieved Chunks
        </span>
        {results.length === 0 ? (
          <div className="text-center p-8 border border-dashed rounded-lg" style={{ borderColor: "var(--sb-border)" }}>
            <span className="text-xs text-[var(--sb-ink-dim)] italic">Query the index above to display chunk vectors...</span>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {results.map((r) => (
              <div key={r.id} className="flex flex-col border border-[var(--sb-border)] p-4 rounded-xl bg-transparent">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold text-rose-500 bg-rose-500/5 px-2 py-0.5 rounded border border-rose-500/10">
                      {r.id}
                    </span>
                    <span className="text-[10px]" style={{ color: "var(--sb-ink-dim)" }}>
                      Source: {r.source}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-[var(--sb-accent)]">
                    Score: {r.score}
                  </span>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: "var(--sb-ink)" }}>
                  {r.text}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 10. API KEY MANAGEMENT TAB
// ─────────────────────────────────────────────────────────────────────────────
function APITab() {
  const [showKey, setShowKey] = useState<Record<string, boolean>>({});
  const [created, setCreated] = useState(false);

  const keys = [
    { name: "Production App Webhook", key: "sk-proj-4o...8h9L", created: "Jan 12, 2026", status: "Active" },
    { name: "LMS Crawler Key", key: "sk-proj-5s...Xy4a", created: "Feb 20, 2026", status: "Active" },
    { name: "Staging sandbox Token", key: "sk-proj-1a...0z2m", created: "Jun 1, 2026", status: "Active" },
  ];

  const toggleShow = (name: string) => {
    setShowKey((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const handleCreateKey = () => {
    setCreated(true);
    setTimeout(() => setCreated(false), 2000);
  };

  return (
    <div className="island-shell rounded-xl p-6 flex flex-col gap-6 animate-in fade-in duration-200">
      <div className="flex items-center justify-between border-b pb-3 border-[var(--sb-border)]">
        <div className="flex flex-col">
          <h2 className="text-sm font-bold" style={{ color: "var(--sb-ink)" }}>API Integrations & Authorization Keys</h2>
          <span className="text-[11px]" style={{ color: "var(--sb-ink-dim)" }}>Issue, review, and delete security bearer keys allowing access to platform completions.</span>
        </div>
        <Button onClick={handleCreateKey} size="xs" className="text-xs w-32 active:scale-95">
          <Plus size={12} className="mr-1.5" />
          Create API Key
        </Button>
      </div>

      {created && (
        <div
          className="p-3 text-xs rounded-xl flex items-center gap-2 border animate-in slide-in-from-top-3 duration-250 text-amber-500 bg-amber-500/10 border-amber-500/20"
        >
          <Lock size={14} />
          Key successfully generated: <strong>sk-proj-9rXw...7A1b</strong>. Copy it immediately as you won't be able to see it again.
        </div>
      )}

      {/* Rate Limits */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border border-[var(--sb-border)] p-4 rounded-xl">
          <div className="flex justify-between text-xs font-semibold mb-1">
            <span style={{ color: "var(--sb-ink)" }}>OpenAI Rate Limits (RPM)</span>
            <span style={{ color: "var(--sb-accent)" }}>600 / 5,000 RPM (12%)</span>
          </div>
          <div className="h-2 w-full bg-[var(--sb-border)] rounded-full overflow-hidden mt-2">
            <div className="h-full bg-[var(--sb-accent)]" style={{ width: "12%" }} />
          </div>
        </div>

        <div className="border border-[var(--sb-border)] p-4 rounded-xl">
          <div className="flex justify-between text-xs font-semibold mb-1">
            <span style={{ color: "var(--sb-ink)" }}>Anthropic Rate Limits (RPM)</span>
            <span className="text-blue-500">80 / 4,000 RPM (2%)</span>
          </div>
          <div className="h-2 w-full bg-[var(--sb-border)] rounded-full overflow-hidden mt-2">
            <div className="h-full bg-blue-500" style={{ width: "2%" }} />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left border-collapse">
          <thead>
            <tr className="border-b" style={{ borderColor: "var(--sb-border)", color: "var(--sb-ink-muted)" }}>
              <th className="pb-3 font-semibold uppercase tracking-wider">Key Label Name</th>
              <th className="pb-3 font-semibold uppercase tracking-wider">Security Token</th>
              <th className="pb-3 font-semibold uppercase tracking-wider">Created Date</th>
              <th className="pb-3 font-semibold uppercase tracking-wider">Status</th>
              <th className="pb-3 font-semibold uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--sb-border)]">
            {keys.map((k) => (
              <tr key={k.name} style={{ color: "var(--sb-ink)" }}>
                <td className="py-3.5 font-semibold">{k.name}</td>
                <td className="py-3.5 font-mono">
                  {showKey[k.name] ? "sk-proj-4oK9xZ73qAr9h9Lw71m2n" : k.key}
                </td>
                <td className="py-3.5" style={{ color: "var(--sb-ink-dim)" }}>{k.created}</td>
                <td className="py-3.5">
                  <Badge className="bg-emerald-500/10 text-emerald-500 border-none font-bold py-0.5 text-[9px]">
                    {k.status}
                  </Badge>
                </td>
                <td className="py-3.5 text-right flex justify-end gap-2">
                  <Button onClick={() => toggleShow(k.name)} size="xs" variant="outline" className="px-2">
                    {showKey[k.name] ? "Hide" : "Reveal"}
                  </Button>
                  <Button size="xs" variant="outline" className="px-2 text-red-500 hover:text-red-600 border-red-500/20 hover:border-red-500/40">
                    <Trash2 size={11} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 11. BACKGROUND JOBS TAB
// ─────────────────────────────────────────────────────────────────────────────
function JobsTab() {
  const jobs = [
    { title: "Syllabus embedding crawl", progress: 100, status: "Success", eta: "Finished 2h ago" },
    { title: "Fine-tune gpt-4o-mini on python-dsa", progress: 68, status: "Running", eta: "12m remaining" },
    { title: "Clean orphan vectors Pinecone", progress: 0, status: "Queued", eta: "Pending queue" },
  ];

  return (
    <div className="island-shell rounded-xl p-6 flex flex-col gap-6 animate-in fade-in duration-200">
      <div className="flex flex-col border-b pb-3 border-[var(--sb-border)]">
        <h2 className="text-sm font-bold" style={{ color: "var(--sb-ink)" }}>Active Pipelines & Fine-tuning Jobs</h2>
        <span className="text-[11px]" style={{ color: "var(--sb-ink-dim)" }}>Manage running training processes and automated index cleans.</span>
      </div>

      <div className="flex flex-col gap-4">
        {jobs.map((job) => (
          <div
            key={job.title}
            className="flex flex-col border border-[var(--sb-border)] p-4 rounded-xl bg-transparent gap-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-xs font-semibold" style={{ color: "var(--sb-ink)" }}>{job.title}</span>
                <span className="text-[10px] mt-0.5" style={{ color: "var(--sb-ink-dim)" }}>{job.eta}</span>
              </div>
              <Badge
                className={cn(
                  "text-[9px] uppercase tracking-wider font-bold py-0.5 px-2",
                  job.status === "Success" && "bg-emerald-500/10 text-emerald-500",
                  job.status === "Running" && "bg-amber-500/15 text-amber-500",
                  job.status === "Queued" && "bg-[color-mix(in_oklab,var(--sb-ink)_8%,transparent)] text-[var(--sb-ink-muted)]"
                )}
              >
                {job.status}
              </Badge>
            </div>

            {/* Progress bar */}
            <div className="flex items-center gap-3">
              <div className="h-1.5 flex-1 bg-[var(--sb-border)] rounded-full overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-300",
                    job.status === "Success" && "bg-emerald-500",
                    job.status === "Running" && "bg-amber-500",
                    job.status === "Queued" && "bg-zinc-500"
                  )}
                  style={{ width: `${job.progress}%` }}
                />
              </div>
              <span className="text-[10px] font-bold shrink-0 w-8 text-right" style={{ color: "var(--sb-ink)" }}>
                {job.progress}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 12. ACTIVITY TIMELINE TAB
// ─────────────────────────────────────────────────────────────────────────────
function TimelineTab() {
  const events = [
    { time: "11:08:42 AM", event: "gpt-4o completion success", details: "DSA evaluation problem #824, duration: 240ms, tokens: 481", success: true },
    { time: "11:07:12 AM", event: "claude-3-5-sonnet completion success", details: "LMS Curriculum Generator, duration: 410ms, tokens: 2090", success: true },
    { time: "11:04:18 AM", event: "gpt-4o-mini completion failed", details: "Rate limit exceeded (fallback model claude-3-5-sonnet successfully utilized)", success: false },
    { time: "10:58:31 AM", event: "gpt-4o completion success", details: "DSA evaluation problem #821, duration: 231ms, tokens: 512", success: true },
    { time: "10:52:14 AM", event: "Pinecone index vector synchronization complete", details: "3 files embedded, total vectors updated: 148", success: true }
  ];

  return (
    <div className="island-shell rounded-xl p-6 flex flex-col gap-6 animate-in fade-in duration-200">
      <div className="flex flex-col border-b pb-3 border-[var(--sb-border)]">
        <h2 className="text-sm font-bold" style={{ color: "var(--sb-ink)" }}>Real-time completion activity log</h2>
        <span className="text-[11px]" style={{ color: "var(--sb-ink-dim)" }}>Live stream of LLM requests, response statuses, and exception warnings.</span>
      </div>

      <div className="relative border-l-2 ml-4 pl-6 space-y-5" style={{ borderColor: "var(--sb-border)" }}>
        {events.map((e, idx) => (
          <div key={idx} className="relative flex flex-col">
            {/* Timeline Dot */}
            <span
              className={cn(
                "absolute -left-[31px] top-1.5 size-2.5 rounded-full border-2 bg-transparent shrink-0",
                e.success ? "border-emerald-500" : "border-red-500"
              )}
              style={{
                backgroundColor: "var(--sb-bg)"
              }}
            />
            <span className="text-[10px] font-semibold" style={{ color: "var(--sb-ink-dim)" }}>{e.time}</span>
            <span className="text-xs font-bold mt-0.5" style={{ color: "var(--sb-ink)" }}>{e.event}</span>
            <span className="text-[10px] mt-1" style={{ color: "var(--sb-ink-muted)" }}>{e.details}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 13. AI SETTINGS TAB
// ─────────────────────────────────────────────────────────────────────────────
function SettingsTab() {
  const [success, setSuccess] = useState(false);
  const [temp, setTemp] = useState("0.7");
  const [cacheTtl, setCacheTtl] = useState("3600");
  const [maxRetries, setMaxRetries] = useState("3");

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2000);
  };

  return (
    <div className="island-shell rounded-xl p-6 flex flex-col gap-6 animate-in fade-in duration-200">
      <div className="flex flex-col border-b pb-3 border-[var(--sb-border)]">
        <h2 className="text-sm font-bold" style={{ color: "var(--sb-ink)" }}>AI Engine Parameters Config</h2>
        <span className="text-[11px]" style={{ color: "var(--sb-ink-dim)" }}>Configure systemic fallback variables, response caching limits, and connection timeouts.</span>
      </div>

      <form onSubmit={handleSaveSettings} className="flex flex-col gap-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Temperature */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="sysTemp" className="text-xs font-bold text-[var(--sb-ink-muted)]">
              Global Default Temperature
            </label>
            <input
              id="sysTemp"
              type="number"
              step="0.1"
              min="0"
              max="2"
              value={temp}
              onChange={(e) => setTemp(e.target.value)}
              required
              className={cn(
                "w-full rounded-[10px] px-3 py-2 text-xs outline-none transition-all duration-150",
                "focus-visible:ring-2 focus-visible:ring-[var(--sb-accent)]/30",
              )}
              style={{
                background: "color-mix(in oklab, var(--sb-ink) 4%, transparent)",
                border: "1px solid var(--sb-border)",
                color: "var(--sb-ink)",
              }}
            />
            <span className="text-[10px]" style={{ color: "var(--sb-ink-dim)" }}>
              0 = deterministic code evaluation; 1+ = creative text responses.
            </span>
          </div>

          {/* Cache TTL */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="cacheTtl" className="text-xs font-bold text-[var(--sb-ink-muted)]">
              Cache TTL Duration (Seconds)
            </label>
            <input
              id="cacheTtl"
              type="number"
              value={cacheTtl}
              onChange={(e) => setCacheTtl(e.target.value)}
              required
              className={cn(
                "w-full rounded-[10px] px-3 py-2 text-xs outline-none transition-all duration-150",
                "focus-visible:ring-2 focus-visible:ring-[var(--sb-accent)]/30",
              )}
              style={{
                background: "color-mix(in oklab, var(--sb-ink) 4%, transparent)",
                border: "1px solid var(--sb-border)",
                color: "var(--sb-ink)",
              }}
            />
            <span className="text-[10px]" style={{ color: "var(--sb-ink-dim)" }}>
              Length of time completion strings remain cached.
            </span>
          </div>

          {/* Max retries */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="maxRetries" className="text-xs font-bold text-[var(--sb-ink-muted)]">
              Provider Rate Limit Retries
            </label>
            <input
              id="maxRetries"
              type="number"
              value={maxRetries}
              onChange={(e) => setMaxRetries(e.target.value)}
              required
              className={cn(
                "w-full rounded-[10px] px-3 py-2 text-xs outline-none transition-all duration-150",
                "focus-visible:ring-2 focus-visible:ring-[var(--sb-accent)]/30",
              )}
              style={{
                background: "color-mix(in oklab, var(--sb-ink) 4%, transparent)",
                border: "1px solid var(--sb-border)",
                color: "var(--sb-ink)",
              }}
            />
            <span className="text-[10px]" style={{ color: "var(--sb-ink-dim)" }}>
              Number of retry attempts if HTTP 429 occurs.
            </span>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 mt-2 border-t pt-4 border-[var(--sb-border)]">
          {success && (
            <span className="text-xs text-emerald-500 font-semibold animate-in fade-in duration-200">
              Systemic AI configurations saved
            </span>
          )}
          <Button type="submit" size="xs" className="w-28 active:scale-95">
            Save AI Config
          </Button>
        </div>
      </form>
    </div>
  );
}
