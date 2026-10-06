"use client";

import { useMemo, useState, type FormEvent, type ReactNode } from "react";
import {
  Activity, ArrowDownToLine, ArrowRight, ArrowUpRight, BadgeCheck, BarChart3, BookOpen, Bot,
  CalendarDays, Check, CheckCircle2, ChevronDown, Clock3, Copy, CreditCard, ExternalLink,
  FileText, Filter, Globe, Headphones, Layers3, Mail, MessageSquare, MoreHorizontal, Plus,
  Plug, Search, Send, Settings, ShieldCheck, Sparkles, Users, Workflow, X,
} from "lucide-react";
import { PageHeading, Panel } from "@/components/dashboard/dashboard-shell";

type Notice = (message: string) => void;

const headers: Record<string, { title: string; description: string; action?: string }> = {
  "AI Agents": { title: "AI Agents", description: "Build, deploy, and manage your AI workforce.", action: "Create agent" },
  Automations: { title: "Automations", description: "Automate the work between conversations, systems, and AI agents.", action: "Create automation" },
  Tasks: { title: "Tasks", description: "Keep AI-generated work and human follow-ups moving.", action: "Create task" },
  Knowledge: { title: "Knowledge", description: "Give your agents a reliable source of truth.", action: "Add source" },
  Customers: { title: "Customers", description: "Manage customers, leads, and AI-generated business context.", action: "Add customer" },
  Conversations: { title: "Conversations", description: "Every customer conversation, in one place.", action: "New conversation" },
  Integrations: { title: "Integrations", description: "Connect your agents to the tools your business already uses.", action: "Browse integrations" },
  Analytics: { title: "Analytics", description: "Understand impact, efficiency, and customer experience.", action: "Export report" },
  "Activity / Logs": { title: "Activity", description: "See what your agents, automations, and team members are doing." },
  Templates: { title: "Templates", description: "Start with proven AI agents and automation workflows.", action: "Create from template" },
  "Team & Roles": { title: "Team & Roles", description: "Manage your team and control what each member can access.", action: "Invite member" },
  Billing: { title: "Billing & Usage", description: "Manage your subscription and monitor platform consumption.", action: "Upgrade plan" },
  Settings: { title: "Settings", description: "Manage your workspace, access, integrations, and security." },
};

export function WorkspaceModule({ section }: { section: string }) {
  const [notice, setNotice] = useState("");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const config = headers[section];
  if (!config) return null;
  const notify: Notice = (message) => {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 2600);
  };
  const action = () => {
    if (section === "Settings") return;
    if (section === "Team & Roles") setSettingsOpen(true);
    else notify(`${config.action} is ready to configure in the next platform phase.`);
  };
  return <main className="mx-auto max-w-[1500px] p-5 md:p-8">
    <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><h1 className="text-[27px] font-semibold leading-tight tracking-[-0.04em] text-[#f2f3f8]">{config.title}</h1><p className="mt-2 text-[13px] text-[#9295a8]">{config.description}</p></div>{config.action && <button onClick={action} className="inline-flex w-fit items-center gap-2 rounded-lg bg-gradient-to-r from-[#6960ed] to-[#9060ed] px-3.5 py-2.5 text-xs font-semibold text-white shadow-[0_6px_18px_#7566ed26] transition hover:brightness-110"><Plus size={14} />{config.action}</button>}</div>
    {section === "AI Agents" && <AgentsScreen notify={notify} />}
    {section === "Automations" && <AutomationsScreen notify={notify} />}
    {section === "Tasks" && <TasksScreen notify={notify} />}
    {section === "Knowledge" && <KnowledgeScreen notify={notify} />}
    {section === "Customers" && <CustomersScreen notify={notify} />}
    {section === "Conversations" && <ConversationsScreen notify={notify} />}
    {section === "Integrations" && <IntegrationsScreen notify={notify} />}
    {section === "Analytics" && <AnalyticsScreen notify={notify} />}
    {section === "Activity / Logs" && <ActivityScreen />}
    {section === "Templates" && <TemplatesScreen notify={notify} />}
    {section === "Team & Roles" && <TeamScreen openInvite={settingsOpen} closeInvite={() => setSettingsOpen(false)} notify={notify} />}
    {section === "Billing" && <BillingScreen notify={notify} />}
    {section === "Settings" && <SettingsScreen notify={notify} />}
    {notice && <div role="status" className="fixed bottom-5 right-5 z-50 flex max-w-sm items-center gap-2 rounded-lg border border-[#39364f] bg-[#1b1a25] px-4 py-3 text-xs text-[#e9e7f2] shadow-2xl"><CheckCircle2 size={15} className="text-[#81d1ad]" />{notice}</div>}
  </main>;
}

function SearchField({ placeholder = "Search...", value, onChange }: { placeholder?: string; value: string; onChange: (value: string) => void }) {
  return <label className="flex h-9 min-w-[190px] items-center gap-2 rounded-lg border border-[#2b2d38] bg-[#111219] px-3 text-[#777b8d] focus-within:border-[#9180ff]/60"><Search size={14} /><input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="w-full bg-transparent text-xs text-[#e7e7ef] outline-none placeholder:text-[#6f7283]" /></label>;
}

function Tabs({ values, active, onChange }: { values: string[]; active: string; onChange: (value: string) => void }) {
  return <div className="flex max-w-full gap-1 overflow-x-auto rounded-lg border border-[#292b36] bg-[#111219] p-1">{values.map((value) => <button key={value} onClick={() => onChange(value)} className={`whitespace-nowrap rounded-md px-3 py-1.5 text-[10px] transition ${active === value ? "bg-[#292632] font-medium text-[#e9e6ff]" : "text-[#85889a] hover:text-white"}`}>{value}</button>)}</div>;
}

function Status({ children, tone = "muted" }: { children: ReactNode; tone?: "green" | "amber" | "red" | "violet" | "blue" | "muted" }) {
  const colors = { green: "border-[#58c99b]/20 bg-[#58c99b]/[0.08] text-[#76d7ae]", amber: "border-[#e7b15f]/20 bg-[#e7b15f]/[0.08] text-[#e7bd7c]", red: "border-[#ed7979]/20 bg-[#ed7979]/[0.08] text-[#ec9898]", violet: "border-[#9b8bff]/20 bg-[#9b8bff]/[0.08] text-[#b8acff]", blue: "border-[#6da8f7]/20 bg-[#6da8f7]/[0.08] text-[#8eb9f7]", muted: "border-[#444653]/50 bg-[#32343e]/40 text-[#a3a5b3]" };
  return <span className={`inline-flex items-center rounded-md border px-2 py-1 text-[9px] font-medium ${colors[tone]}`}>{children}</span>;
}

function Metric({ label, value, delta, icon: Icon, tone = "violet" }: { label: string; value: string; delta?: string; icon: typeof Bot; tone?: string }) {
  return <div className="rounded-xl border border-[#262833] bg-[#14151d] p-4"><div className="flex items-center justify-between"><span className="text-[11px] text-[#9295a8]">{label}</span><Icon size={15} className="text-[#a99aff]" /></div><div className="mt-3 flex items-end justify-between"><span className="text-[24px] font-semibold leading-none tracking-[-0.04em] text-[#f1f1f6]">{value}</span>{delta && <span className="text-[10px] text-[#72c9a1]">{delta}</span>}</div></div>;
}

function Avatar({ name, color = "#9180ff" }: { name: string; color?: string }) {
  return <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-[10px] font-semibold" style={{ backgroundColor: `${color}20`, color }}>{name.split(/\s+/).map((part) => part[0]).slice(0, 2).join("").toUpperCase()}</span>;
}

const agents = [
  { name: "Nova", purpose: "Sales Agent", status: "Active", model: "GPT-4o", tools: "HubSpot, Gmail", channel: "Web chat", tasks: "342", rate: "96.2%", last: "2 min ago", color: "#a99aff" },
  { name: "Atlas", purpose: "Customer Support", status: "Active", model: "Claude 3.5 Sonnet", tools: "Intercom, Knowledge", channel: "WhatsApp, Web", tasks: "286", rate: "94.8%", last: "5 min ago", color: "#73c9aa" },
  { name: "Luna", purpose: "Scheduling", status: "Active", model: "GPT-4o mini", tools: "Google Calendar", channel: "Email", tasks: "198", rate: "98.1%", last: "8 min ago", color: "#df91c3" },
  { name: "Scout", purpose: "Lead Generation", status: "Training", model: "GPT-4o", tools: "HubSpot, Web", channel: "Web chat", tasks: "â€”", rate: "â€”", last: "1 hour ago", color: "#80a8f4" },
  { name: "Echo", purpose: "Customer Success", status: "Paused", model: "Gemini 2.5 Pro", tools: "HubSpot, Gmail", channel: "Email", tasks: "154", rate: "91.7%", last: "Yesterday", color: "#e6b46d" },
  { name: "Sage", purpose: "Product Expert", status: "Active", model: "Claude 3.5 Sonnet", tools: "Knowledge, Slack", channel: "Web chat", tasks: "221", rate: "97.6%", last: "12 min ago", color: "#6ebdc9" },
];

function AgentsScreen({ notify }: { notify: Notice }) {
  const [tab, setTab] = useState("All agents");
  const [query, setQuery] = useState("");
  const filtered = agents.filter((agent) => (tab === "All agents" || agent.status === tab) && `${agent.name} ${agent.purpose} ${agent.status}`.toLowerCase().includes(query.toLowerCase()));
  const tone = (status: string) => status === "Active" ? "green" : status === "Training" ? "blue" : "muted";
  return <><div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><Tabs values={["All agents", "Active", "Training", "Paused", "Archived"]} active={tab} onChange={setTab} /><SearchField value={query} onChange={setQuery} placeholder="Search agents" /></div><div className="grid gap-3 md:grid-cols-2 2xl:grid-cols-3">{filtered.map((agent) => <article key={agent.name} className="rounded-xl border border-[#262833] bg-[#14151d] p-4 transition hover:border-[#3c3d4b]"><div className="flex items-start gap-3"><Avatar name={agent.name} color={agent.color} /><div className="min-w-0 flex-1"><div className="flex items-center gap-2"><h2 className="text-sm font-semibold text-[#ececf2]">{agent.name}</h2><Status tone={tone(agent.status)}>{agent.status}</Status><button aria-label={`More about ${agent.name}`} className="ml-auto text-[#7d8091] hover:text-white"><MoreHorizontal size={16} /></button></div><p className="mt-1 text-[11px] text-[#8f92a3]">{agent.purpose}</p></div></div><div className="mt-4 grid grid-cols-2 gap-y-3 border-t border-[#272833] pt-3 text-[10px]"><Info label="AI model" value={agent.model} /><Info label="Connected tools" value={agent.tools} /><Info label="Channels" value={agent.channel} /><Info label="Last active" value={agent.last} /></div><div className="mt-4 flex items-center justify-between rounded-lg bg-[#111219] px-3 py-2.5"><div><p className="text-[9px] text-[#828596]">Tasks completed</p><p className="mt-1 text-xs font-semibold text-[#e6e6ed]">{agent.tasks}</p></div><div className="text-right"><p className="text-[9px] text-[#828596]">Success rate</p><p className="mt-1 text-xs font-semibold text-[#e6e6ed]">{agent.rate}</p></div><button onClick={() => notify(`${agent.name} configuration opened.`)} className="rounded-md border border-[#343541] px-2.5 py-1.5 text-[9px] text-[#d7d8e0] hover:border-[#9180ff]/60">Configure</button></div></article>)}</div>{filtered.length === 0 && <Empty text="No agents match these filters." />}</>;
}

function Info({ label, value }: { label: string; value: string }) { return <div className="min-w-0"><p className="text-[#76798b]">{label}</p><p className="mt-1 truncate text-[#c9cad4]">{value}</p></div>; }
function Empty({ text }: { text: string }) { return <div className="rounded-xl border border-dashed border-[#333542] px-6 py-12 text-center text-sm text-[#85889a]">{text}</div>; }

const automations = [
  { name: "Inbound Lead Qualification", status: "Active", runs: "1,284", success: "97.8%", trigger: "New website lead", agent: "Nova", updated: "Today" },
  { name: "Support Escalation", status: "Active", runs: "842", success: "96.4%", trigger: "Low sentiment detected", agent: "Atlas", updated: "Yesterday" },
  { name: "Sales Follow-up", status: "Active", runs: "526", success: "94.9%", trigger: "Quote viewed", agent: "Nova", updated: "Oct 4" },
  { name: "Weekly Account Summary", status: "Draft", runs: "â€”", success: "â€”", trigger: "Every Monday", agent: "Sage", updated: "Oct 2" },
];

function AutomationsScreen({ notify }: { notify: Notice }) {
  const [tab, setTab] = useState("All");
  const [selected, setSelected] = useState(automations[0].name);
  const visible = automations.filter((item) => tab === "All" || item.status === tab);
  const active = automations.find((item) => item.name === selected) ?? automations[0];
  const steps = [
    { title: "Trigger", detail: active.trigger, color: "#83a9f8", icon: ZapIcon },
    { title: "AI Agent", detail: active.agent, color: "#a99aff", icon: Bot },
    { title: "Condition", detail: "Lead score > 70", color: "#e4b366", icon: Filter },
    { title: "Action", detail: "Create CRM task", color: "#69c6a7", icon: Check },
    { title: "Human approval", detail: "Before sending quote", color: "#de91c2", icon: ShieldCheck },
  ];

  return (
    <>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Tabs values={["All", "Active", "Draft", "Paused", "Failed"]} active={tab} onChange={setTab} />
        <button onClick={() => notify("Automation builder is ready for the next platform phase.")} className="inline-flex items-center gap-2 self-start rounded-lg border border-[#333541] px-3 py-2 text-[10px] text-[#c6c7d1] hover:border-[#9180ff]/60"><Filter size={13} />Filter</button>
      </div>
      <div className="grid gap-4 xl:grid-cols-[1.45fr_1fr]">
        <Panel title="Your automations" action={`${visible.length} shown`}>
          <div className="divide-y divide-[#252630]">
            {visible.map((item) => (
              <button key={item.name} onClick={() => setSelected(item.name)} className={`flex w-full items-center gap-3 px-4 py-3.5 text-left transition ${selected === item.name ? "bg-[#9180ff]/[0.04]" : "hover:bg-white/[0.02]"}`}>
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#9180ff]/[0.1] text-[#a99aff]"><Workflow size={15} /></span>
                <div className="min-w-0 flex-1"><p className="truncate text-xs font-medium text-[#e6e6ed]">{item.name}</p><p className="mt-1 text-[10px] text-[#85889a]">{item.trigger}</p></div>
                <div className="hidden text-right sm:block"><p className="text-[10px] text-[#dddde5]">{item.runs} runs</p><p className="mt-1 text-[9px] text-[#818496]">{item.success} success</p></div>
                <Status tone={item.status === "Active" ? "green" : "muted"}>{item.status}</Status>
              </button>
            ))}
          </div>
        </Panel>
        <Panel title="Workflow preview" action="Draft v3">
          <div className="p-4">
            <div className="rounded-lg border border-[#2b2d38] bg-[#111219] p-3"><p className="text-[10px] font-medium text-[#e5e5ec]">{active.name}</p><p className="mt-1 text-[9px] text-[#828596]">Triggered by {active.trigger.toLowerCase()}</p></div>
            <div className="mx-auto h-4 w-px bg-[#46434f]" />
            <div className="space-y-0">
              {steps.map((step, index) => {
                const StepIcon = step.icon;
                return (
                  <div key={step.title}>
                    <div className="flex items-center gap-3 rounded-lg border border-[#2a2c37] bg-[#171820] px-3 py-2.5">
                      <span className="grid h-7 w-7 place-items-center rounded-md" style={{ backgroundColor: `${step.color}16`, color: step.color }}><StepIcon size={13} /></span>
                      <div className="min-w-0"><p className="text-[10px] font-medium text-[#e4e4eb]">{step.title}</p><p className="mt-0.5 truncate text-[9px] text-[#838697]">{step.detail}</p></div>
                      <span className="ml-auto text-[9px] text-[#66697a]">{String(index + 1).padStart(2, "0")}</span>
                    </div>
                    {index < steps.length - 1 && <div className="mx-auto h-3 w-px bg-[#46434f]" />}
                  </div>
                );
              })}
            </div>
            <button onClick={() => notify("Workflow builder will be available in a later phase.")} className="mt-3 w-full rounded-lg border border-[#343541] py-2.5 text-[10px] font-medium text-[#c9cad4] hover:border-[#9180ff]/60">Open workflow builder</button>
          </div>
        </Panel>
      </div>
    </>
  );
}
function ZapIcon({ size = 14 }: { size?: number }) { return <Sparkles size={size} />; }

type TaskRecord = { title: string; customer: string; priority: "High" | "Medium" | "Low"; assignee: string; agent: string; due: string; status: string; created: string };
const initialTasks: TaskRecord[] = [
  { title: "Review Novaâ€™s quotation", customer: "Meridian Labs", priority: "High", assignee: "Alex Morgan", agent: "Nova", due: "Today, 3:00 PM", status: "Needs Approval", created: "Oct 6" },
  { title: "Follow up with Meridian Labs", customer: "Meridian Labs", priority: "Medium", assignee: "Jordan Lee", agent: "Nova", due: "Today, 4:30 PM", status: "In Progress", created: "Oct 6" },
  { title: "Review new lead from website", customer: "Vertex Systems", priority: "High", assignee: "Alex Morgan", agent: "Nova", due: "Oct 7", status: "Pending", created: "Oct 6" },
  { title: "Approve customer email", customer: "Aster Studio", priority: "Medium", assignee: "Casey Williams", agent: "Atlas", due: "Today, 5:00 PM", status: "Needs Approval", created: "Oct 5" },
  { title: "Update HubSpot contact", customer: "Northstar Co.", priority: "Low", assignee: "Jordan Lee", agent: "Nova", due: "Oct 4", status: "Completed", created: "Oct 3" },
  { title: "Escalate refund request", customer: "Kiteworks", priority: "High", assignee: "Sam Rivera", agent: "Atlas", due: "Oct 6", status: "Failed", created: "Oct 6" },
];

function TasksScreen({ notify }: { notify: Notice }) {
  const [tab, setTab] = useState("All");
  const [tasks, setTasks] = useState(initialTasks);
  const [query, setQuery] = useState("");
  const filtered = tasks.filter((task) => {
    const matchTab = tab === "All" || (tab === "My Tasks" ? task.assignee === "Alex Morgan" : tab === "Running" ? task.status === "In Progress" : tab === "Needs Approval" ? task.status === "Needs Approval" : task.status === tab);
    return matchTab && `${task.title} ${task.customer} ${task.agent}`.toLowerCase().includes(query.toLowerCase());
  });
  const setStatus = (title: string, status: string) => { setTasks((rows) => rows.map((row) => row.title === title ? { ...row, status } : row)); notify(`Task ${status === "Completed" ? "approved" : "updated"}.`); };
  const tone = (status: string) => status === "Completed" ? "green" : status === "Needs Approval" ? "amber" : status === "Failed" ? "red" : status === "In Progress" ? "blue" : "muted";
  return <><div className="mb-4 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between"><Tabs values={["All", "My Tasks", "Running", "Completed", "Failed", "Needs Approval"]} active={tab} onChange={setTab} /><SearchField value={query} onChange={setQuery} placeholder="Search tasks" /></div><div className="overflow-hidden rounded-xl border border-[#262833] bg-[#14151d]"><div className="overflow-x-auto"><table className="w-full min-w-[850px] text-left"><thead className="border-b border-[#282a34] bg-[#111219] text-[9px] uppercase tracking-wide text-[#7d8091]"><tr>{["Task", "Priority", "Assignee", "Agent", "Due date", "Status", "Created", ""].map((head) => <th key={head} className="px-4 py-3 font-medium">{head}</th>)}</tr></thead><tbody className="divide-y divide-[#252630]">{filtered.map((task) => <tr key={task.title} className="hover:bg-white/[0.015]"><td className="px-4 py-3"><p className="text-[11px] font-medium text-[#e5e5ec]">{task.title}</p><p className="mt-1 text-[9px] text-[#808394]">{task.customer}</p></td><td className="px-4 py-3"><span className={`text-[10px] ${task.priority === "High" ? "text-[#e79292]" : task.priority === "Medium" ? "text-[#e2b977]" : "text-[#9295a8]"}`}>{task.priority}</span></td><td className="px-4 py-3 text-[10px] text-[#c5c6d0]">{task.assignee}</td><td className="px-4 py-3 text-[10px] text-[#b4a7ff]">{task.agent}</td><td className="px-4 py-3 text-[10px] text-[#a6a8b5]">{task.due}</td><td className="px-4 py-3"><Status tone={tone(task.status)}>{task.status}</Status></td><td className="px-4 py-3 text-[10px] text-[#85889a]">{task.created}</td><td className="px-4 py-3">{task.status === "Needs Approval" ? <button onClick={() => setStatus(task.title, "Completed")} className="rounded-md border border-[#423d2f] px-2.5 py-1.5 text-[9px] text-[#e8c27e] hover:bg-[#e8c27e]/10">Approve</button> : task.status !== "Completed" && <button onClick={() => setStatus(task.title, "In Progress")} className="text-[10px] text-[#9990eb] hover:text-white">Open</button>}</td></tr>)}</tbody></table></div>{filtered.length === 0 && <div className="p-8"><Empty text="No tasks in this view." /></div>}</div></>;
}

type Source = { name: string; type: string; updated: string; size: string; status: "Indexed" | "Processing" | "Syncing" | "Failed" };
const initialSources: Source[] = [
  { name: "Product Handbook.pdf", type: "Document", updated: "Oct 6, 2026", size: "4.2 MB", status: "Indexed" },
  { name: "Pricing & Plans.pdf", type: "Document", updated: "Oct 6, 2026", size: "1.8 MB", status: "Indexed" },
  { name: "Customer FAQ.docx", type: "Document", updated: "Oct 5, 2026", size: "824 KB", status: "Processing" },
  { name: "help.forma.io", type: "Website", updated: "Oct 5, 2026", size: "42 pages", status: "Syncing" },
  { name: "Sales Playbook.pdf", type: "Document", updated: "Oct 4, 2026", size: "2.1 MB", status: "Failed" },
  { name: "Returns Policy.pdf", type: "Document", updated: "Oct 3, 2026", size: "960 KB", status: "Indexed" },
];

function KnowledgeScreen({ notify }: { notify: Notice }) {
  const [tab, setTab] = useState("Knowledge sources");
  const [sources, setSources] = useState(initialSources);
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState("");
  const rows = sources.filter((source) => (tab === "Knowledge sources" || (tab === "Documents" ? source.type === "Document" : tab === "Websites" ? source.type === "Website" : true)) && source.name.toLowerCase().includes(query.toLowerCase()));
  const retry = (name: string) => { setSources((items) => items.map((item) => item.name === name ? { ...item, status: "Processing" } : item)); notify(`${name} queued for re-indexing.`); };
  const ask = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); setAnswer("The Business plan includes expanded AI usage, up to 20 agents, priority support, and team collaboration. Answer grounded in Pricing & Plans.pdf."); };
  return <><div className="mb-4 grid gap-3 sm:grid-cols-3"><Metric label="Knowledge sources" value="24" icon={BookOpen} /><Metric label="Indexed documents" value="18" icon={FileText} /><Metric label="Storage used" value="18 GB" icon={Layers3} /></div><div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between"><Tabs values={["Knowledge sources", "Documents", "Websites", "FAQs", "Manual knowledge"]} active={tab} onChange={setTab} /><SearchField value={query} onChange={setQuery} placeholder="Search sources" /></div><div className="grid gap-4 xl:grid-cols-[1.5fr_1fr]"><Panel title={tab} action={`${rows.length} sources`}><div className="divide-y divide-[#252630]">{rows.map((source) => <div key={source.name} className="flex items-center gap-3 px-4 py-3"><span className="grid h-8 w-8 place-items-center rounded-lg bg-[#9180ff]/[0.09] text-[#a99aff]">{source.type === "Website" ? <Globe size={15} /> : <FileText size={15} />}</span><div className="min-w-0 flex-1"><p className="truncate text-[11px] font-medium text-[#e5e5ec]">{source.name}</p><p className="mt-1 text-[9px] text-[#85889a]">{source.type} Â· {source.size} Â· Updated {source.updated}</p></div><Status tone={source.status === "Indexed" ? "green" : source.status === "Failed" ? "red" : "amber"}>{source.status}</Status>{source.status === "Failed" && <button onClick={() => retry(source.name)} className="text-[9px] text-[#a99aff]">Retry</button>}</div>)}</div></Panel><Panel title="Test your knowledge" action="Preview"><form onSubmit={ask} className="p-4"><label className="text-[10px] text-[#9295a8]">Ask a question about your sources</label><div className="mt-2 flex rounded-lg border border-[#30323e] bg-[#111219] focus-within:border-[#9180ff]/60"><input placeholder="What is included in the Business plan?" className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-[10px] text-[#e4e4ec] outline-none placeholder:text-[#6f7283]" /><button aria-label="Ask knowledge" className="px-3 text-[#a99aff]"><ArrowRight size={15} /></button></div></form>{answer && <div className="mx-4 mb-4 rounded-lg border border-[#2b2d38] bg-[#111219] p-3"><div className="mb-2 flex items-center gap-2 text-[10px] text-[#c8c2ff]"><Sparkles size={12} />Answer preview</div><p className="text-[10px] leading-5 text-[#c2c4cf]">{answer}</p></div>}<div className="border-t border-[#252630] px-4 py-3 text-[9px] text-[#777a8b]">Responses show source attribution and are only a preview.</div></Panel></div></>;
}

type Customer = { name: string; company: string; status: string; score: number; source: string; agent: string; contact: string; next: string; color: string };
const customers: Customer[] = [
  { name: "Olivia Chen", company: "Meridian Labs", status: "Qualified", score: 92, source: "Website", agent: "Nova", contact: "Today", next: "Send proposal", color: "#a99aff" },
  { name: "Marcus Reed", company: "Vertex Systems", status: "Lead", score: 86, source: "WhatsApp", agent: "Nova", contact: "Yesterday", next: "Book discovery", color: "#6ec4a5" },
  { name: "Sofia Patel", company: "Aster Studio", status: "Meeting booked", score: 89, source: "Website", agent: "Luna", contact: "Oct 5", next: "Product demo Â· Oct 8", color: "#de91c2" },
  { name: "Ethan Park", company: "Northstar Co.", status: "Customer", score: 98, source: "Referral", agent: "Atlas", contact: "Oct 4", next: "Quarterly check-in", color: "#83a9f8" },
  { name: "Amara Okafor", company: "Kiteworks", status: "Inactive", score: 54, source: "LinkedIn", agent: "Nova", contact: "Sep 28", next: "Re-engage lead", color: "#dfb873" },
];

function CustomersScreen({ notify }: { notify: Notice }) {
  const [tab, setTab] = useState("All");
  const [query, setQuery] = useState("");
  const filtered = customers.filter((customer) => (tab === "All" || (tab === "Leads" ? customer.status === "Lead" || customer.status === "Qualified" : tab === "Qualified" ? customer.status === "Qualified" : tab === "Customers" ? customer.status === "Customer" : customer.status === "Inactive")) && `${customer.name} ${customer.company}`.toLowerCase().includes(query.toLowerCase()));
  const statusTone = (status: string) => status === "Customer" ? "green" : status === "Qualified" ? "violet" : status === "Meeting booked" ? "blue" : status === "Inactive" ? "muted" : "amber";
  return <><div className="mb-4 grid gap-3 sm:grid-cols-3"><Metric label="Total customers" value="2,418" delta="+8.2%" icon={Users} /><Metric label="Open leads" value="86" delta="+12 this week" icon={Sparkles} /><Metric label="Qualified this month" value="34" icon={BadgeCheck} /></div><div className="mb-4 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between"><Tabs values={["All", "Leads", "Qualified", "Customers", "Inactive"]} active={tab} onChange={setTab} /><SearchField value={query} onChange={setQuery} placeholder="Search customers" /></div><div className="overflow-hidden rounded-xl border border-[#262833] bg-[#14151d]"><div className="overflow-x-auto"><table className="w-full min-w-[900px] text-left"><thead className="border-b border-[#282a34] bg-[#111219] text-[9px] uppercase tracking-wide text-[#7d8091]"><tr>{["Customer", "Company", "Status", "Lead score", "Source", "Assigned agent", "Last contact", "Next action"].map((head) => <th key={head} className="px-4 py-3 font-medium">{head}</th>)}</tr></thead><tbody className="divide-y divide-[#252630]">{filtered.map((customer) => <tr key={customer.name} className="cursor-pointer hover:bg-white/[0.02]" onClick={() => notify(`${customer.name} profile opened.`)}><td className="px-4 py-3"><div className="flex items-center gap-2.5"><Avatar name={customer.name} color={customer.color} /><span className="text-[10px] font-medium text-[#e6e6ed]">{customer.name}</span></div></td><td className="px-4 py-3 text-[10px] text-[#c4c5d0]">{customer.company}</td><td className="px-4 py-3"><Status tone={statusTone(customer.status)}>{customer.status}</Status></td><td className="px-4 py-3"><span className="text-[10px] font-semibold text-[#e6e6ed]">{customer.score}</span><div className="mt-1 h-1 w-12 rounded-full bg-[#2c2e3a]"><div className="h-full rounded-full bg-[#8e7dff]" style={{ width: `${customer.score}%` }} /></div></td><td className="px-4 py-3 text-[10px] text-[#a9abba]">{customer.source}</td><td className="px-4 py-3 text-[10px] text-[#b5a8ff]">{customer.agent}</td><td className="px-4 py-3 text-[10px] text-[#9295a8]">{customer.contact}</td><td className="px-4 py-3 text-[10px] text-[#c5c6d0]">{customer.next}</td></tr>)}</tbody></table></div></div></>;
}

type Thread = { name: string; company: string; channel: string; preview: string; time: string; unread?: boolean; color: string; sentiment: string; intent: string; score: string; agent: string };
const threads: Thread[] = [
  { name: "Olivia Chen", company: "Meridian Labs", channel: "Web chat", preview: "Could you send over a quote for the enterprise plan?", time: "2m", unread: true, color: "#a99aff", sentiment: "Positive", intent: "Pricing inquiry", score: "92", agent: "Nova" },
  { name: "Marcus Reed", company: "Vertex Systems", channel: "WhatsApp", preview: "Thursday afternoon works well for us.", time: "18m", color: "#70c5a6", sentiment: "Positive", intent: "Book a meeting", score: "86", agent: "Luna" },
  { name: "Sofia Patel", company: "Aster Studio", channel: "Email", preview: "Thanks for helping us get started!", time: "1h", color: "#df91c3", sentiment: "Positive", intent: "Onboarding", score: "89", agent: "Atlas" },
  { name: "Ethan Park", company: "Northstar Co.", channel: "Instagram", preview: "Do you support multiple locations?", time: "3h", color: "#83a9f8", sentiment: "Neutral", intent: "Product question", score: "74", agent: "Sage" },
  { name: "Amara Okafor", company: "Kiteworks", channel: "Voice", preview: "I need help with a recent invoice.", time: "Yesterday", color: "#dfb873", sentiment: "Needs attention", intent: "Billing support", score: "54", agent: "Atlas" },
];

function ConversationsScreen({ notify }: { notify: Notice }) {
  const [selected, setSelected] = useState(0);
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<Record<number, string[]>>({ 0: ["Hi Olivia, thanks for reaching out. I can help with an enterprise quote.", "Could you send over a quote for the enterprise plan?"] });
  const thread = threads[selected];
  const send = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); if (!draft.trim()) return; setMessages((all) => ({ ...all, [selected]: [...(all[selected] ?? []), draft.trim()] })); setDraft(""); notify("Reply added to this demo conversation."); };
  return <div className="grid min-h-[570px] overflow-hidden rounded-xl border border-[#282a35] bg-[#14151d] lg:grid-cols-[250px_minmax(0,1fr)_245px]"><section className="border-b border-[#282a35] lg:border-b-0 lg:border-r"><div className="flex items-center justify-between border-b border-[#282a35] px-3.5 py-3"><div><h2 className="text-xs font-semibold">Inbox</h2><p className="mt-1 text-[9px] text-[#818496]">12 open conversations</p></div><button className="text-[#a99aff]" aria-label="Conversation filters"><Filter size={14} /></button></div><div className="border-b border-[#282a35] p-3"><SearchField value="" onChange={() => {}} placeholder="Search inbox" /></div><div className="max-h-[360px] overflow-y-auto lg:max-h-[470px]">{threads.map((item, index) => <button key={item.name} onClick={() => setSelected(index)} className={`flex w-full gap-2.5 border-b border-[#242630] px-3 py-3 text-left ${selected === index ? "bg-[#9180ff]/[0.08]" : "hover:bg-white/[0.02]"}`}><Avatar name={item.name} color={item.color} /><span className="min-w-0 flex-1"><span className="flex items-center gap-1.5"><span className="truncate text-[10px] font-medium text-[#e2e3ea]">{item.name}</span>{item.unread && <i className="h-1.5 w-1.5 rounded-full bg-[#a99aff]" />}<span className="ml-auto text-[8px] text-[#7d8091]">{item.time}</span></span><span className="mt-1 block truncate text-[9px] text-[#838697]">{item.preview}</span><span className="mt-1.5 block text-[8px] text-[#aaa0d8]">{item.channel} Â· {item.agent}</span></span></button>)}</div></section><section className="flex min-h-[430px] flex-col"><div className="flex items-center gap-2.5 border-b border-[#282a35] px-4 py-3"><Avatar name={thread.name} color={thread.color} /><div className="min-w-0 flex-1"><h2 className="truncate text-xs font-semibold">{thread.name}</h2><p className="mt-0.5 text-[9px] text-[#85889a]">{thread.company} Â· {thread.channel}</p></div><Status tone="green">Open</Status><button onClick={() => notify("Human takeover toggled for this demo.")} className="rounded-md border border-[#353744] px-2 py-1.5 text-[9px] text-[#c5c6d0]">Take over</button></div><div className="flex-1 space-y-3 overflow-y-auto bg-[#111219]/60 p-4">{(messages[selected] ?? [thread.preview]).map((message, index) => <div key={`${index}-${message}`} className={`max-w-[82%] rounded-xl px-3 py-2.5 text-[10px] leading-5 ${index % 2 === 0 ? "bg-[#22232d] text-[#d8d9e2]" : "ml-auto bg-[#5148a0]/30 text-[#e4e0ff]"}`}>{message}<p className="mt-1 text-right text-[8px] text-[#85889a]">{index % 2 === 0 ? "Nova Â· 10:42 AM" : "Customer Â· 10:44 AM"}</p></div>)}</div><form onSubmit={send} className="flex items-center gap-2 border-t border-[#282a35] p-3"><input value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Reply to customer..." className="min-w-0 flex-1 rounded-lg border border-[#30323e] bg-[#111219] px-3 py-2.5 text-[10px] text-[#e5e5ec] outline-none placeholder:text-[#737687] focus:border-[#9180ff]/60" /><button className="grid h-8 w-8 place-items-center rounded-lg bg-[#7869e9] text-white hover:bg-[#8878f0]" aria-label="Send reply"><Send size={14} /></button></form></section><aside className="hidden border-l border-[#282a35] lg:block"><div className="border-b border-[#282a35] px-4 py-3"><h2 className="text-xs font-semibold">Customer context</h2><p className="mt-1 text-[9px] text-[#85889a]">AI-generated profile</p></div><div className="p-4"><div className="flex items-center gap-2.5"><Avatar name={thread.name} color={thread.color} /><div><p className="text-[10px] font-medium">{thread.name}</p><p className="mt-0.5 text-[9px] text-[#85889a]">{thread.company}</p></div></div><div className="mt-4 space-y-3 border-t border-[#292b36] pt-4"><Info label="Assigned agent" value={thread.agent} /><Info label="Sentiment" value={thread.sentiment} /><Info label="Intent" value={thread.intent} /><Info label="Lead score" value={`${thread.score} / 100`} /></div><div className="mt-4 border-t border-[#292b36] pt-4"><p className="mb-2 text-[9px] font-medium uppercase tracking-wide text-[#777a8b]">Tags</p><div className="flex flex-wrap gap-1.5"><Status tone="violet">Enterprise</Status><Status tone="blue">New lead</Status></div></div><button onClick={() => notify("Customer profile opened.")} className="mt-5 w-full rounded-lg border border-[#343541] py-2 text-[9px] text-[#c5c6d0]">View customer profile</button></div></aside></div>;
}

type Integration = { name: string; description: string; category: string; status: "Connected" | "Connect" | "Reconnect" | "Error"; icon: string; color: string };
const integrationSeed: Integration[] = [
  { name: "Gmail", description: "Send and receive business email.", category: "Communication", status: "Connected", icon: "G", color: "#e67c72" },
  { name: "Google Calendar", description: "Schedule and manage events.", category: "Calendar", status: "Connected", icon: "â–¦", color: "#7aa7f5" },
  { name: "Slack", description: "Keep your team in the loop.", category: "Communication", status: "Connected", icon: "#ce8ee1", color: "#ce8ee1" },
  { name: "HubSpot", description: "Sync contacts, deals, and tasks.", category: "CRM", status: "Connected", icon: "H", color: "#ef986f" },
  { name: "Shopify", description: "Connect your online store.", category: "E-commerce", status: "Connected", icon: "S", color: "#91bd6a" },
  { name: "WooCommerce", description: "Manage orders and products.", category: "E-commerce", status: "Connect", icon: "W", color: "#a98ce1" },
  { name: "Stripe", description: "Read payment and subscription data.", category: "Payments", status: "Connected", icon: "S", color: "#9381e9" },
  { name: "WhatsApp", description: "Chat with customers on WhatsApp.", category: "Communication", status: "Connected", icon: "W", color: "#64c899" },
  { name: "REST API", description: "Connect a custom business service.", category: "Developer tools", status: "Connect", icon: "</>", color: "#8fa3bb" },
  { name: "Webhooks", description: "Send and receive event payloads.", category: "Automation", status: "Connected", icon: "â†—", color: "#71c2b2" },
];

function IntegrationsScreen({ notify }: { notify: Notice }) {
  const categories = ["All", "Communication", "CRM", "Calendar", "Payments", "E-commerce", "Automation", "Developer tools"];
  const [category, setCategory] = useState("All");
  const [items, setItems] = useState(integrationSeed);
  const [query, setQuery] = useState("");
  const visible = items.filter((item) => (category === "All" || item.category === category) && item.name.toLowerCase().includes(query.toLowerCase()));
  const toggle = (name: string) => setItems((rows) => rows.map((item) => item.name === name ? { ...item, status: item.status === "Connected" ? "Connect" : "Connected" } : item));
  const tone = (status: string) => status === "Connected" ? "green" : status === "Error" ? "red" : status === "Reconnect" ? "amber" : "muted";
  return <><div className="mb-4 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between"><div className="flex max-w-full gap-1 overflow-x-auto">{categories.map((item) => <button key={item} onClick={() => setCategory(item)} className={`whitespace-nowrap rounded-lg px-3 py-2 text-[10px] ${category === item ? "bg-[#292632] text-[#e6e2ff]" : "text-[#85889a] hover:bg-white/[0.03] hover:text-white"}`}>{item}</button>)}</div><SearchField value={query} onChange={setQuery} placeholder="Search integrations" /></div><div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{visible.map((item) => <article key={item.name} className="rounded-xl border border-[#262833] bg-[#14151d] p-4"><div className="flex items-start gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl border border-[#2e303a] bg-[#111219] text-sm font-semibold" style={{ color: item.color }}>{item.icon}</span><div className="min-w-0 flex-1"><div className="flex items-center gap-2"><h2 className="text-xs font-semibold text-[#e6e6ed]">{item.name}</h2><Status tone={tone(item.status)}>{item.status}</Status></div><p className="mt-1.5 min-h-8 text-[10px] leading-4 text-[#85889a]">{item.description}</p></div></div><div className="mt-4 flex items-center justify-between border-t border-[#292b36] pt-3"><span className="text-[9px] text-[#777a8b]">{item.category}</span><button onClick={() => { toggle(item.name); notify(`${item.name} connection updated in this demo.`); }} className={`rounded-md px-3 py-1.5 text-[9px] font-medium ${item.status === "Connected" ? "border border-[#343541] text-[#bdbfca] hover:border-[#e28f8f]/50 hover:text-[#e9a4a4]" : "bg-[#51489c]/50 text-[#e6e1ff] hover:bg-[#6357c5]/60"}`}>{item.status === "Connected" ? "Manage" : item.status === "Reconnect" ? "Reconnect" : "Connect"}</button></div></article>)}</div>{visible.length === 0 && <Empty text="No integrations found." />}</>;
}

function AnalyticsScreen({ notify }: { notify: Notice }) {
  const [range, setRange] = useState("30 days");
  const stats = [{ label: "Conversations", value: "38,420", delta: "+18.2%" }, { label: "Resolution rate", value: "94.8%", delta: "+2.4%" }, { label: "Customer satisfaction", value: "4.8 / 5", delta: "+0.3" }, { label: "Cost / conversation", value: "$0.024", delta: "âˆ’12.6%" }, { label: "AI tokens", value: "8.2M", delta: "+9.4%" }, { label: "Estimated time saved", value: "142h", delta: "+21h" }];
  return <><div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><Tabs values={["7 days", "30 days", "90 days", "Custom"]} active={range} onChange={setRange} /><span className="text-[10px] text-[#777a8b]">Showing data for the last {range.toLowerCase()}</span></div><div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{stats.map((item) => <div key={item.label} className="rounded-xl border border-[#262833] bg-[#14151d] p-4"><p className="text-[10px] text-[#8c8fa0]">{item.label}</p><div className="mt-2 flex items-end justify-between"><p className="text-[22px] font-semibold tracking-[-0.04em]">{item.value}</p><span className="text-[9px] text-[#72c9a1]">{item.delta}</span></div></div>)}</div><div className="mt-4 grid gap-4 xl:grid-cols-2"><ChartPanel title="Conversation volume" range={range} /><ChartPanel title="Agent performance" range={range} /><ChartPanel title="Automation success" range={range} /><ChartPanel title="AI cost & lead conversion" range={range} /></div><div className="mt-4"><Panel title="Business impact"><div className="grid gap-4 p-4 sm:grid-cols-3"><Info label="Top agent" value="Luna Â· 98.1% success" /><Info label="Most effective automation" value="Inbound Lead Qualification" /><Info label="Estimated value generated" value="$24,680 this month" /></div></Panel></div><button onClick={() => notify("Analytics report prepared for download in this demo.")} className="sr-only">Export report</button></>;
}

function ChartPanel({ title, range }: { title: string; range: string }) {
  return <Panel title={title} action={range}><div className="p-4"><div className="relative h-[150px]"><div className="absolute inset-0 flex flex-col justify-between">{[0,1,2,3].map((i) => <div key={i} className="border-t border-dashed border-[#292a35]" />)}</div><svg viewBox="0 0 600 150" preserveAspectRatio="none" className="absolute inset-0 h-full w-full"><defs><linearGradient id={`fill-${title.replace(/\W/g, "")}`} x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#9180ff" stopOpacity=".22"/><stop offset="1" stopColor="#9180ff" stopOpacity="0"/></linearGradient></defs><path d="M0 120 C35 100 55 115 90 92 S145 80 180 95 S230 56 270 69 S320 46 360 55 S420 30 460 47 S525 20 560 34 S585 22 600 18 L600 150 L0 150Z" fill={`url(#fill-${title.replace(/\W/g, "")})`} /><path d="M0 120 C35 100 55 115 90 92 S145 80 180 95 S230 56 270 69 S320 46 360 55 S420 30 460 47 S525 20 560 34 S585 22 600 18" fill="none" stroke="#9888ff" strokeWidth="2" /></svg></div><div className="mt-2 flex justify-between text-[8px] text-[#737687]">{["Oct 1", "Oct 5", "Oct 10", "Oct 15", "Oct 20", "Oct 25", "Oct 30"].map((day) => <span key={day}>{day}</span>)}</div></div></Panel>;
}

const activityItems = [
  { actor: "Nova", action: "qualified a new lead", resource: "Olivia Chen Â· Meridian Labs", time: "2 minutes ago", kind: "Agents", status: "Completed", color: "#a99aff", icon: Bot },
  { actor: "Atlas", action: "resolved ticket #2048", resource: "Support conversation", time: "5 minutes ago", kind: "Agents", status: "Completed", color: "#6ac7a6", icon: Headphones },
  { actor: "Luna", action: "booked a product demo", resource: "Sofia Patel Â· Aster Studio", time: "8 minutes ago", kind: "Agents", status: "Completed", color: "#df91c3", icon: CalendarDays },
  { actor: "Jordan Lee", action: "updated Novaâ€™s instructions", resource: "AI Agents Â· Nova", time: "14 minutes ago", kind: "Team", status: "Updated", color: "#7da4ee", icon: Users },
  { actor: "Lead Qualification", action: "automation completed", resource: "Workflow execution #1842", time: "21 minutes ago", kind: "Automations", status: "Completed", color: "#e1b66e", icon: Workflow },
  { actor: "HubSpot", action: "contact sync completed", resource: "Integration Â· 12 records", time: "39 minutes ago", kind: "Integrations", status: "Synced", color: "#78c0b4", icon: Plug },
  { actor: "Alex Morgan", action: "signed in from a new device", resource: "Security Â· Chrome on Windows", time: "1 hour ago", kind: "Security", status: "Verified", color: "#a0a3b2", icon: ShieldCheck },
];

function ActivityScreen() {
  const [filter, setFilter] = useState("All activity");
  const visible = activityItems.filter((item) => filter === "All activity" || item.kind === filter);
  return <><div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><Tabs values={["All activity", "Agents", "Automations", "Team", "Integrations", "Security"]} active={filter} onChange={setFilter} /><button className="inline-flex items-center gap-2 rounded-lg border border-[#2d2f3a] px-3 py-2 text-[10px] text-[#a5a7b5]"><CalendarDays size={12} />Last 7 days<ChevronDown size={12} /></button></div><Panel title="Activity log" action={`${visible.length} events`}><div className="divide-y divide-[#252630]">{visible.map((item, index) => <div key={`${item.actor}-${index}`} className="flex items-center gap-3 px-4 py-3.5"><span className="grid h-8 w-8 place-items-center rounded-lg" style={{ color: item.color, backgroundColor: `${item.color}15` }}><item.icon size={14} /></span><div className="min-w-0 flex-1"><p className="truncate text-[11px] text-[#d9dae2]"><strong className="font-medium text-[#f0f0f5]">{item.actor}</strong> {item.action}</p><p className="mt-1 truncate text-[9px] text-[#828596]">{item.resource}</p></div><div className="hidden text-right sm:block"><p className="text-[9px] text-[#a5a7b5]">{item.time}</p><p className="mt-1 text-[8px] text-[#777a8b]">{item.kind}</p></div><Status tone={item.status === "Completed" ? "green" : "blue"}>{item.status}</Status></div>)}</div></Panel><p className="mt-3 text-[9px] text-[#6f7283]">Activity records identify the actor, action, resource, timestamp and result.</p></>;
}

type TemplateRecord = { name: string; description: string; category: string; tools: string; setup: string; icon: string; color: string };
const templates: TemplateRecord[] = [
  { name: "AI Lead Qualification", description: "Score and qualify inbound leads automatically.", category: "Sales", tools: "HubSpot Â· Gmail", setup: "5 min", icon: "LQ", color: "#a99aff" },
  { name: "AI Sales Follow-up", description: "Send timely, personalized follow-ups after sales calls.", category: "Sales", tools: "Gmail Â· HubSpot", setup: "7 min", icon: "SF", color: "#83a9f8" },
  { name: "AI Customer Support", description: "Resolve common customer questions using your knowledge.", category: "Support", tools: "WhatsApp Â· Knowledge", setup: "10 min", icon: "CS", color: "#6ac7a6" },
  { name: "AI Appointment Booking", description: "Find a time, book a meeting, and send confirmations.", category: "Scheduling", tools: "Calendar Â· Gmail", setup: "6 min", icon: "AB", color: "#df91c3" },
  { name: "AI RFQ Processing", description: "Extract requests for quote and route them for review.", category: "Operations", tools: "Gmail Â· Knowledge", setup: "12 min", icon: "RFQ", color: "#e0b56d" },
  { name: "AI Quote Generation", description: "Prepare a draft quote from your products and pricing.", category: "Sales", tools: "HubSpot Â· Gmail", setup: "9 min", icon: "QG", color: "#80c2d0" },
  { name: "AI Invoice Processing", description: "Extract invoice details and flag exceptions for review.", category: "Operations", tools: "Email Â· REST API", setup: "8 min", icon: "IP", color: "#c59beb" },
  { name: "AI Website Lead Management", description: "Capture website inquiries and create CRM follow-ups.", category: "Lead Generation", tools: "Webhooks Â· HubSpot", setup: "5 min", icon: "LM", color: "#80a8f4" },
  { name: "AI E-commerce Support", description: "Answer order, shipping, and product questions.", category: "E-commerce", tools: "Shopify Â· Knowledge", setup: "8 min", icon: "EC", color: "#91bd6a" },
  { name: "AI Recruitment Screening", description: "Summarize applicants against your role requirements.", category: "Recruitment", tools: "Gmail Â· Drive", setup: "10 min", icon: "RS", color: "#d9967d" },
];

function TemplatesScreen({ notify }: { notify: Notice }) {
  const categories = ["All", "Sales", "Support", "Lead Generation", "Scheduling", "E-commerce", "Operations", "Recruitment"];
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");
  const visible = templates.filter((item) => (category === "All" || item.category === category) && `${item.name} ${item.description}`.toLowerCase().includes(query.toLowerCase()));
  return <><div className="mb-4 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between"><div className="flex max-w-full gap-1 overflow-x-auto">{categories.map((item) => <button key={item} onClick={() => setCategory(item)} className={`whitespace-nowrap rounded-lg px-3 py-2 text-[10px] ${category === item ? "bg-[#292632] text-[#e6e2ff]" : "text-[#85889a] hover:bg-white/[0.03] hover:text-white"}`}>{item}</button>)}</div><SearchField value={query} onChange={setQuery} placeholder="Search templates" /></div><div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{visible.map((item) => <article key={item.name} className="rounded-xl border border-[#262833] bg-[#14151d] p-4"><div className="flex items-start gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl text-[10px] font-semibold" style={{ color: item.color, backgroundColor: `${item.color}16` }}>{item.icon}</span><div><Status tone="violet">{item.category}</Status><h2 className="mt-2 text-xs font-semibold text-[#e7e7ee]">{item.name}</h2></div></div><p className="mt-3 min-h-8 text-[10px] leading-4 text-[#8c8fa0]">{item.description}</p><div className="mt-4 flex items-center justify-between border-t border-[#292b36] pt-3"><div><p className="text-[8px] uppercase tracking-wide text-[#727587]">Recommended tools</p><p className="mt-1 text-[9px] text-[#c1c2cd]">{item.tools}</p></div><span className="text-right"><p className="text-[8px] uppercase tracking-wide text-[#727587]">Setup</p><p className="mt-1 text-[9px] text-[#c1c2cd]">~{item.setup}</p></span></div><button onClick={() => notify(`${item.name} template selected. Add your integrations to continue.`)} className="mt-3 w-full rounded-lg border border-[#373845] py-2 text-[10px] font-medium text-[#d9d9e3] transition hover:border-[#9180ff]/60 hover:text-white">Use template</button></article>)}</div></>;
}

type Member = { name: string; email: string; role: string; status: string; last: string; color: string };
const initialMembers: Member[] = [
  { name: "Alex Morgan", email: "alex@formastudio.com", role: "Owner", status: "Active", last: "Now", color: "#a99aff" },
  { name: "Jordan Lee", email: "jordan@formastudio.com", role: "Admin", status: "Active", last: "12 min ago", color: "#70c5a6" },
  { name: "Casey Williams", email: "casey@formastudio.com", role: "Manager", status: "Active", last: "1 hour ago", color: "#df91c3" },
  { name: "Sam Rivera", email: "sam@formastudio.com", role: "Viewer", status: "Active", last: "Yesterday", color: "#83a9f8" },
  { name: "Taylor Brooks", email: "taylor@formastudio.com", role: "Viewer", status: "Pending", last: "Invite sent Oct 5", color: "#dfb873" },
];

function TeamScreen({ openInvite, closeInvite, notify }: { openInvite: boolean; closeInvite: () => void; notify: Notice }) {
  const [members, setMembers] = useState(initialMembers);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Member");
  const invite = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const address = email.trim().toLowerCase();
    if (!address) return;
    const name = address.split("@")[0].split(/[._-]/).map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" ");
    setMembers((rows) => [...rows, { name, email: address, role, status: "Pending", last: "Invite sent just now", color: "#a99aff" }]);
    setEmail(""); closeInvite(); notify(`Invitation prepared for ${address}.`);
  };
  return <><div className="grid gap-3 sm:grid-cols-3"><Metric label="Team members" value="7 / 10" icon={Users} /><Metric label="Pending invites" value="1" icon={Mail} /><Metric label="Workspace role" value="Pro workspace" icon={ShieldCheck} /></div><div className="mt-4 grid gap-4 xl:grid-cols-[1.5fr_1fr]"><Panel title="Workspace members" action={`${members.length} members`}><div className="divide-y divide-[#252630]">{members.map((member) => <div key={member.email} className="flex items-center gap-3 px-4 py-3"><Avatar name={member.name} color={member.color} /><div className="min-w-0 flex-1"><p className="truncate text-[10px] font-medium text-[#e3e4eb]">{member.name}</p><p className="mt-0.5 truncate text-[9px] text-[#828596]">{member.email}</p></div><span className="hidden text-[9px] text-[#85889a] sm:block">{member.last}</span><select aria-label={`Role for ${member.name}`} value={member.role} disabled={member.role === "Owner"} onChange={(event) => setMembers((rows) => rows.map((row) => row.email === member.email ? { ...row, role: event.target.value } : row))} className="rounded-md border border-[#30323e] bg-[#111219] px-2 py-1.5 text-[9px] text-[#c7c8d2] outline-none disabled:opacity-60"><option>Owner</option><option>Admin</option><option>Manager</option><option>Member</option><option>Viewer</option></select><Status tone={member.status === "Active" ? "green" : "amber"}>{member.status}</Status></div>)}</div></Panel><Panel title="Roles & permissions"><div className="divide-y divide-[#252630]">{[{ role: "Owner", access: "Full workspace access" }, { role: "Admin", access: "Workspace management" }, { role: "Manager", access: "Agents, automations, customers" }, { role: "Member", access: "Daily operations" }, { role: "Viewer", access: "Read-only access" }].map((item) => <div key={item.role} className="flex items-center justify-between px-4 py-3"><div><p className="text-[10px] font-medium text-[#dedfe6]">{item.role}</p><p className="mt-1 text-[9px] text-[#85889a]">{item.access}</p></div><ArrowRight size={13} className="text-[#686b7c]" /></div>)}</div></Panel></div>{openInvite && <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) closeInvite(); }}><div role="dialog" aria-modal="true" aria-labelledby="invite-heading" className="w-full max-w-md rounded-2xl border border-[#343541] bg-[#15161e] p-5 shadow-2xl"><div className="flex items-start justify-between"><div><h2 id="invite-heading" className="text-base font-semibold">Invite a team member</h2><p className="mt-1 text-xs text-[#85889a]">Theyâ€™ll get access to the Forma Studio workspace.</p></div><button onClick={closeInvite} aria-label="Close invite dialog" className="text-[#85889a]"><X size={17} /></button></div><form onSubmit={invite} className="mt-5 space-y-4"><label className="block text-[10px] text-[#bfc0cb]">Work email<input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="teammate@company.com" className="mt-2 w-full rounded-lg border border-[#30323e] bg-[#111219] px-3 py-2.5 text-xs outline-none focus:border-[#9180ff]/60" /></label><label className="block text-[10px] text-[#bfc0cb]">Workspace role<select value={role} onChange={(event) => setRole(event.target.value)} className="mt-2 w-full rounded-lg border border-[#30323e] bg-[#111219] px-3 py-2.5 text-xs outline-none"><option>Admin</option><option>Manager</option><option>Member</option><option>Viewer</option></select></label><div className="flex justify-end gap-2 pt-2"><button type="button" onClick={closeInvite} className="rounded-lg border border-[#343541] px-3 py-2 text-xs text-[#c2c3ce]">Cancel</button><button className="rounded-lg bg-[#7669e7] px-3 py-2 text-xs font-medium text-white">Send invitation</button></div></form></div></div>}</>;
}

function BillingScreen({ notify }: { notify: Notice }) {
  const usage = [{ label: "AI agents", used: 12, max: 20, suffix: "12 / 20" }, { label: "Messages", used: 38420, max: 50000, suffix: "38,420 / 50,000" }, { label: "AI tokens", used: 8.2, max: 12, suffix: "8.2M / 12M" }, { label: "Team members", used: 7, max: 10, suffix: "7 / 10" }, { label: "Knowledge storage", used: 18, max: 25, suffix: "18 GB / 25 GB" }];
  return <><div className="grid gap-4 xl:grid-cols-[1fr_1.4fr]"><section className="rounded-xl border border-[#37334e] bg-gradient-to-br from-[#1c1a29] to-[#15151c] p-5"><div className="flex items-center gap-2"><span className="grid h-8 w-8 place-items-center rounded-lg bg-[#9180ff]/15 text-[#b5aaff]"><Sparkles size={15} /></span><Status tone="violet">CURRENT PLAN</Status></div><h2 className="mt-5 text-lg font-semibold">Business</h2><p className="mt-1 text-[11px] text-[#9698a9]">Everything your team needs to scale its AI workforce.</p><p className="mt-5 text-3xl font-semibold tracking-[-0.05em]">$149<span className="ml-1 text-xs font-normal tracking-normal text-[#9295a8]">/ month</span></p><button onClick={() => notify("Plan management will be available in the billing phase.")} className="mt-5 w-full rounded-lg bg-gradient-to-r from-[#6960ed] to-[#9060ed] py-2.5 text-[10px] font-semibold text-white">Upgrade plan</button><button onClick={() => notify("Subscription management opened in this demo.")} className="mt-2 w-full rounded-lg border border-[#353744] py-2 text-[10px] text-[#c8c9d2]">Manage subscription</button></section><Panel title="Usage this billing period" action="Resets Nov 1"><div className="space-y-4 p-4">{usage.map((item) => <div key={item.label}><div className="mb-1.5 flex justify-between text-[10px]"><span className="text-[#c8c9d2]">{item.label}</span><span className="text-[#85889a]">{item.suffix}</span></div><div className="h-1.5 overflow-hidden rounded-full bg-[#2a2b36]"><div className={`h-full rounded-full ${item.used / item.max > 0.8 ? "bg-[#e1b365]" : "bg-gradient-to-r from-[#7064eb] to-[#a092ff]"}`} style={{ width: `${Math.min(100, item.used / item.max * 100)}%` }} /></div></div>)}</div></Panel></div><div className="mt-4 grid gap-4 xl:grid-cols-[1.5fr_1fr]"><Panel title="Billing history" action="View all invoices"><div className="divide-y divide-[#252630]">{[{ month: "October 2026", date: "Oct 1, 2026", amount: "$149.00", status: "Paid" }, { month: "September 2026", date: "Sep 1, 2026", amount: "$149.00", status: "Paid" }, { month: "August 2026", date: "Aug 1, 2026", amount: "$149.00", status: "Paid" }].map((invoice) => <div key={invoice.month} className="flex items-center gap-3 px-4 py-3"><span className="grid h-8 w-8 place-items-center rounded-lg bg-[#22232d] text-[#9d9fad]"><FileText size={14} /></span><div className="flex-1"><p className="text-[10px] font-medium text-[#dedfe6]">{invoice.month}</p><p className="mt-0.5 text-[9px] text-[#85889a]">{invoice.date}</p></div><Status tone="green">{invoice.status}</Status><p className="w-16 text-right text-[10px] text-[#d5d6df]">{invoice.amount}</p><button aria-label={`Download ${invoice.month} invoice`} onClick={() => notify("Invoice download prepared in this demo.")} className="text-[#85889a] hover:text-white"><ArrowDownToLine size={14} /></button></div>)}</div></Panel><Panel title="Payment method"><div className="p-4"><div className="flex items-center gap-3 rounded-lg border border-[#30323e] bg-[#111219] p-3"><CreditCard size={17} className="text-[#9d91ff]" /><div><p className="text-[10px] font-medium text-[#e3e4eb]">Visa ending in 4242</p><p className="mt-1 text-[9px] text-[#85889a]">Expires 08 / 2028</p></div><Status tone="green">Default</Status></div><button onClick={() => notify("Payment method settings opened in this demo.")} className="mt-3 text-[10px] text-[#a99aff]">Update payment method <ArrowRight size={11} className="ml-1 inline" /></button></div></Panel></div></>;
}

function SettingsScreen({ notify }: { notify: Notice }) {
  const tabs = ["General", "Workspace", "Members & Roles", "AI Settings", "Security", "Notifications", "API Keys", "Webhooks", "Audit Logs"];
  const [tab, setTab] = useState("General");
  const [workspaceName, setWorkspaceName] = useState("Forma Studio");
  const [timezone, setTimezone] = useState("America/New_York");
  const [twoFactor, setTwoFactor] = useState(true);
  const [timeout, setTimeoutValue] = useState("24 hours");
  const [apiKeyVisible, setApiKeyVisible] = useState(false);
  const [notifications, setNotifications] = useState({ approvals: true, failures: true, weekly: false });
  const save = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); notify(`${tab} settings saved in this demo.`); };
  const copy = async () => { try { await navigator.clipboard.writeText("orb_live_demo_key_replace_me"); notify("Demo API key copied."); } catch { notify("Clipboard unavailable in this browser."); } };
  return <div className="grid gap-4 lg:grid-cols-[205px_minmax(0,1fr)]"><nav className="flex gap-1 overflow-x-auto rounded-xl border border-[#262833] bg-[#14151d] p-2 lg:block lg:space-y-0.5 lg:self-start">{tabs.map((item) => <button key={item} onClick={() => setTab(item)} className={`whitespace-nowrap rounded-lg px-3 py-2 text-left text-[10px] lg:block lg:w-full ${tab === item ? "bg-[#9180ff]/[0.11] font-medium text-[#e9e6ff]" : "text-[#8a8d9f] hover:bg-white/[0.03] hover:text-white"}`}>{item}</button>)}</nav><div className="min-w-0"><Panel title={tab} action="Workspace settings"><form onSubmit={save} className="space-y-5 p-4 sm:p-5">{(tab === "General" || tab === "Workspace") && <><div className="grid gap-4 sm:grid-cols-2"><Field label="Workspace name" value={workspaceName} onChange={setWorkspaceName} /><Field label="Workspace URL" value="orbit.ai/forma" readOnly /><label className="block text-[10px] text-[#bfc0cb]">Timezone<select value={timezone} onChange={(event) => setTimezone(event.target.value)} className="mt-2 w-full rounded-lg border border-[#30323e] bg-[#111219] px-3 py-2.5 text-xs text-[#e5e5ec] outline-none"><option>America/New_York</option><option>America/Los_Angeles</option><option>Europe/London</option><option>UTC</option></select></label><label className="block text-[10px] text-[#bfc0cb]">Currency<select defaultValue="USD" className="mt-2 w-full rounded-lg border border-[#30323e] bg-[#111219] px-3 py-2.5 text-xs text-[#e5e5ec] outline-none"><option>USD</option><option>EUR</option><option>GBP</option><option>PKR</option></select></label></div><div className="border-t border-[#292b36] pt-4"><p className="text-[10px] font-medium text-[#dedfe6]">Workspace defaults</p><p className="mt-1 text-[9px] text-[#85889a]">Used for reports, scheduled automations and billing.</p></div></>}{tab === "Security" && <><div className="flex items-center justify-between rounded-lg border border-[#2d2f3a] bg-[#111219] p-3"><div><p className="text-[10px] font-medium text-[#e1e2e9]">Two-factor authentication</p><p className="mt-1 text-[9px] text-[#85889a]">Require a second factor when team members sign in.</p></div><button type="button" role="switch" aria-checked={twoFactor} onClick={() => setTwoFactor(!twoFactor)} className={`relative h-5 w-9 rounded-full transition ${twoFactor ? "bg-[#7769ea]" : "bg-[#3a3c47]"}`}><span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition ${twoFactor ? "left-[18px]" : "left-0.5"}`} /></button></div><label className="block max-w-sm text-[10px] text-[#bfc0cb]">Session timeout<select value={timeout} onChange={(event) => setTimeoutValue(event.target.value)} className="mt-2 w-full rounded-lg border border-[#30323e] bg-[#111219] px-3 py-2.5 text-xs text-[#e5e5ec] outline-none"><option>1 hour</option><option>8 hours</option><option>24 hours</option><option>7 days</option></select></label><div className="flex items-center gap-2 border-t border-[#292b36] pt-4 text-[9px] text-[#79cda9]"><ShieldCheck size={13} />Workspace security is enabled</div></>}{tab === "API Keys" && <><div><p className="text-[10px] font-medium text-[#dedfe6]">Production API Key</p><p className="mt-1 text-[9px] text-[#85889a]">Use this key to authenticate requests from your server.</p></div><div className="flex max-w-xl items-center gap-2 rounded-lg border border-[#30323e] bg-[#111219] p-2"><code className="min-w-0 flex-1 truncate px-2 text-[10px] text-[#c3c4ce]">{apiKeyVisible ? "orb_live_demo_key_replace_me" : "â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"}</code><button type="button" onClick={() => setApiKeyVisible(!apiKeyVisible)} className="rounded-md border border-[#383a46] px-2 py-1.5 text-[9px] text-[#bebfca]">{apiKeyVisible ? "Hide" : "Reveal"}</button><button type="button" onClick={copy} className="rounded-md p-1.5 text-[#9f94ff]" aria-label="Copy API key"><Copy size={13} /></button></div><button type="button" onClick={() => notify("A real API key can be generated after API access is enabled.")} className="text-[10px] text-[#e09b9b]">Regenerate key</button></>}{tab === "Webhooks" && <><Field label="Webhook URL" value="https://api.forma.io/events" /><div><p className="mb-2 text-[10px] font-medium text-[#dedfe6]">Subscribed events</p><div className="flex flex-wrap gap-2">{["conversation.created", "lead.qualified", "workflow.completed", "approval.requested"].map((event) => <Status key={event} tone="blue">{event}</Status>)}</div></div><button type="button" onClick={() => notify("Webhook delivery test queued in this demo.")} className="rounded-lg border border-[#343541] px-3 py-2 text-[10px] text-[#c5c6d0]">Send test event</button></>}{tab === "Notifications" && <div className="space-y-3">{[{ key: "approvals" as const, label: "Approval requests", detail: "When an agent needs your review" }, { key: "failures" as const, label: "Automation failures", detail: "When a workflow needs attention" }, { key: "weekly" as const, label: "Weekly summary", detail: "A digest of workspace activity" }].map((item) => <label key={item.key} className="flex items-center justify-between rounded-lg border border-[#2d2f3a] bg-[#111219] p-3"><span><span className="block text-[10px] text-[#dedfe6]">{item.label}</span><span className="mt-1 block text-[9px] text-[#85889a]">{item.detail}</span></span><input type="checkbox" checked={notifications[item.key]} onChange={(event) => setNotifications((current) => ({ ...current, [item.key]: event.target.checked }))} className="accent-[#9180ff]" /></label>)}</div>}{tab === "AI Settings" && <><Field label="Default AI provider" value="OpenAI" readOnly /><Field label="Default model" value="GPT-4o" readOnly /><label className="block text-[10px] text-[#bfc0cb]">Human approval threshold<select defaultValue="$500" className="mt-2 w-full max-w-sm rounded-lg border border-[#30323e] bg-[#111219] px-3 py-2.5 text-xs text-[#e5e5ec] outline-none"><option>All external actions</option><option>$100</option><option>$500</option><option>$1,000</option></select></label></>}{tab === "Members & Roles" && <><p className="text-[10px] text-[#aeb0bd]">Manage workspace access and role permissions from Team &amp; Roles.</p><a href="/team" className="inline-flex items-center gap-1 text-[10px] text-[#b2a7ff]">Open Team &amp; Roles<ArrowRight size={12} /></a></>}{tab === "Audit Logs" && <><p className="text-[10px] text-[#aeb0bd]">Audit records capture workspace changes and security events.</p><a href="/activity" className="inline-flex items-center gap-1 text-[10px] text-[#b2a7ff]">View activity log<ArrowRight size={12} /></a></>}{!["Members & Roles", "Audit Logs"].includes(tab) && <div className="flex justify-end border-t border-[#292b36] pt-4"><button className="rounded-lg bg-[#7165e4] px-4 py-2 text-[10px] font-semibold text-white">Save changes</button></div>}</form></Panel></div></div>;
}

function Field({ label, value, onChange, readOnly = false }: { label: string; value: string; onChange?: (value: string) => void; readOnly?: boolean }) {
  return <label className="block text-[10px] text-[#bfc0cb]">{label}<input value={value} readOnly={readOnly} onChange={onChange ? (event) => onChange(event.target.value) : undefined} className="mt-2 w-full rounded-lg border border-[#30323e] bg-[#111219] px-3 py-2.5 text-xs text-[#e5e5ec] outline-none read-only:text-[#85889a] focus:border-[#9180ff]/60" /></label>;
}
