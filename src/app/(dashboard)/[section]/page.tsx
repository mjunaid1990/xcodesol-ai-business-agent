import { notFound } from "next/navigation";
import { Check, Clock3, LockKeyhole } from "lucide-react";
import { navItems } from "@/components/dashboard/sidebar";
import { PageHeading, Panel } from "@/components/dashboard/dashboard-shell";

const descriptions: Record<string, string> = {
  "AI Agents": "Build, deploy, and manage your AI workforce.",
  Automations: "Automate the work between conversations, systems, and AI agents.",
  Tasks: "Keep AI-generated work and human follow-ups moving.",
  Knowledge: "Give your agents a reliable source of truth.",
  Customers: "Manage customers, leads, and AI-generated business context.",
  Conversations: "Every customer conversation, in one place.",
  Integrations: "Connect your agents to the tools your business already uses.",
  Analytics: "Understand impact, efficiency, and customer experience.",
  "Activity / Logs": "See what your agents, automations, and team members are doing.",
  Templates: "Start with proven AI agents and automation workflows.",
  "Team & Roles": "Manage your team and control what each member can access.",
  Billing: "Manage your subscription and monitor platform consumption.",
  Settings: "Manage your workspace, access, integrations, and security.",
};

const actions: Record<string, string> = {
  "AI Agents": "Create agent", Automations: "Create automation", Tasks: "Create task", Knowledge: "Add source", Customers: "Add customer", Conversations: "New conversation", Integrations: "Browse integrations", Analytics: "Export report", Templates: "Create from template", "Team & Roles": "Invite member", Billing: "Upgrade plan",
};

export function generateStaticParams() { return navItems.filter((item) => item.href !== "/dashboard").map(({ href }) => ({ section: href.slice(1) })); }

export default async function SectionPage({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;
  const item = navItems.find((entry) => entry.href === `/${section}`);
  if (!item) notFound();
  const description = descriptions[item.label];
  return <main className="mx-auto max-w-[1500px] p-5 md:p-8"><PageHeading title={item.label === "Billing" ? "Billing & Usage" : item.label === "Activity / Logs" ? "Activity" : item.label} description={description} primary={actions[item.label]} />
    <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr]"><Panel title="Coming up in your workspace"><div className="p-5"><div className="mb-4 grid h-10 w-10 place-items-center rounded-xl border border-[#9180ff]/20 bg-[#9180ff]/[0.09] text-[#a99aff]"><LockKeyhole size={17} /></div><h2 className="text-base font-medium text-[#ececf2]">This area is part of the foundation roadmap</h2><p className="mt-2 max-w-lg text-sm leading-6 text-[#9295a8]">Your workspace navigation and access are ready. This module will become available as the platform features are built out.</p><div className="mt-5 flex flex-wrap gap-2"><span className="rounded-md border border-[#2e3040] bg-[#1a1a24] px-2.5 py-1.5 text-[10px] text-[#bcb4ff]">Foundation</span><span className="rounded-md border border-[#2e3040] bg-[#1a1a24] px-2.5 py-1.5 text-[10px] text-[#aaaebe]">Workspace protected</span></div></div></Panel><Panel title="Platform roadmap"><div className="divide-y divide-[#252630]">{[{ title: "Workspace foundation", detail: "Accounts, access, and dashboard", done: true }, { title: "AI agents", detail: "Configure and run business agents", done: false }, { title: "Approvals and tasks", detail: "Keep people in control", done: false }, { title: "Knowledge and automations", detail: "Connect business context and work", done: false }].map((phase) => <div key={phase.title} className="flex items-center gap-3 px-4 py-3"><span className={`grid h-6 w-6 place-items-center rounded-full ${phase.done ? "bg-[#62c59b]/10 text-[#73cfaa]" : "bg-[#22232d] text-[#777a8b]"}`}>{phase.done ? <Check size={12} /> : <Clock3 size={12} />}</span><div><p className="text-[11px] font-medium text-[#dedfe7]">{phase.title}</p><p className="mt-0.5 text-[10px] text-[#85889a]">{phase.detail}</p></div><span className={`ml-auto text-[9px] ${phase.done ? "text-[#73cfaa]" : "text-[#797c8e]"}`}>{phase.done ? "READY" : "PLANNED"}</span></div>)}</div></Panel></div>
  </main>;
}
