"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, BarChart3, BookOpen, Bot, CheckSquare, ChevronDown, CreditCard, LayoutDashboard, Layers3, LogOut, MessageSquare, Plug, Settings, Users, UsersRound, Workflow } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { logoutAction, switchWorkspaceAction } from "@/app/auth-actions";

export const navItems: { label: string; href: string; icon: LucideIcon; group: "workspace" | "management" }[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, group: "workspace" },
  { label: "AI Agents", href: "/ai-agents", icon: Bot, group: "workspace" },
  { label: "Automations", href: "/automations", icon: Workflow, group: "workspace" },
  { label: "Tasks", href: "/tasks", icon: CheckSquare, group: "workspace" },
  { label: "Knowledge", href: "/knowledge", icon: BookOpen, group: "workspace" },
  { label: "Customers", href: "/customers", icon: Users, group: "workspace" },
  { label: "Conversations", href: "/conversations", icon: MessageSquare, group: "workspace" },
  { label: "Integrations", href: "/integrations", icon: Plug, group: "workspace" },
  { label: "Analytics", href: "/analytics", icon: BarChart3, group: "workspace" },
  { label: "Activity / Logs", href: "/activity", icon: Activity, group: "workspace" },
  { label: "Templates", href: "/templates", icon: Layers3, group: "workspace" },
  { label: "Team & Roles", href: "/team", icon: UsersRound, group: "management" },
  { label: "Billing", href: "/billing", icon: CreditCard, group: "management" },
  { label: "Settings", href: "/settings", icon: Settings, group: "management" },
];

export function Sidebar({ workspace, user, workspaces, active = "Dashboard" }: {
  workspace: { id: string; name: string }; user: { id: string; name: string; email: string; role: string };
  workspaces: { id: string; name: string }[]; active?: string;
}) {
  const pathname = usePathname();
  const current = navItems.find((item) => item.href === pathname)?.label ?? active;
  return <><details className="fixed left-3 top-[17px] z-40 lg:hidden"><summary aria-label="Open navigation" className="grid h-8 w-8 cursor-pointer list-none place-items-center rounded-md border border-[#292b36] bg-[#14151d] text-[#d9dae2]"><span className="text-sm">☰</span></summary><div className="absolute left-0 top-10 w-[240px] rounded-xl border border-[#2a2b36] bg-[#101118] p-3 shadow-2xl"><p className="mb-3 px-2 text-xs font-semibold tracking-wide">orbit <span className="text-[#9c8cff]">/ AI</span><span className="ml-2 text-[9px] font-normal text-[#85889a]">{workspace.name}</span></p><NavGroup title="WORKSPACE" group="workspace" active={current} /><div className="my-3 border-t border-[#262833]" /><NavGroup title="MANAGEMENT" group="management" active={current} /></div></details><aside className="fixed inset-y-0 left-0 z-30 hidden w-[232px] flex-col border-r border-[#262833] bg-[#101118] lg:flex">
    <div className="flex h-[68px] items-center border-b border-[#262833] px-5"><Link href="/dashboard" className="flex items-center gap-2.5"><span className="grid h-8 w-8 place-items-center rounded-[10px] bg-gradient-to-br from-[#a69aff] to-[#6d5ce7] text-sm font-bold text-white">o</span><span className="text-[16px] font-semibold tracking-[-0.04em]">orbit <span className="text-[#9c8cff]">/ AI</span></span></Link></div>
    <div className="px-3 pt-4"><form action={switchWorkspaceAction} className="relative"><select aria-label="Switch workspace" name="workspaceId" defaultValue={workspace.id} onChange={(event) => event.currentTarget.form?.requestSubmit()} className="w-full appearance-none rounded-lg border border-[#2a2b36] bg-[#171820] py-2.5 pl-3 pr-9 text-left text-xs font-semibold tracking-[0.07em] text-[#ededf3] outline-none focus:border-[#9180ff]/60">{workspaces.map((item) => <option key={item.id} value={item.id}>{item.name.toUpperCase()}</option>)}</select><ChevronDown size={14} className="pointer-events-none absolute right-3 top-3 text-[#85889a]" /><p className="px-3 pt-1.5 text-[11px] text-[#7d8091]">Pro workspace</p></form></div>
    <nav className="mt-6 flex-1 overflow-y-auto px-3 pb-4"><NavGroup title="WORKSPACE" group="workspace" active={current} /><div className="my-5 border-t border-[#262833]" /><NavGroup title="MANAGEMENT" group="management" active={current} /></nav>
    <div className="border-t border-[#262833] p-3"><div className="mb-3 flex items-center gap-2 px-2 text-[10px] text-[#888b9c]"><span className="h-1.5 w-1.5 rounded-full bg-[#5dd6a0] shadow-[0_0_8px_#5dd6a055]" /> All systems operational</div><div className="flex items-center gap-2.5 rounded-lg p-2"><div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#373447] text-[10px] font-semibold text-[#d9d2ff]">{initials(user.name)}</div><div className="min-w-0 flex-1"><p className="truncate text-xs font-medium text-[#e3e3e9]">{user.name}</p><p className="truncate text-[10px] capitalize text-[#818496]">{user.role}</p></div><form action={logoutAction}><button title="Sign out" className="rounded-md p-1.5 text-[#7f8294] hover:bg-white/5 hover:text-white"><LogOut size={15} /></button></form></div></div>
  </aside></>;
}

function NavGroup({ title, group, active }: { title: string; group: "workspace" | "management"; active: string }) {
  return <section><p className="mb-2 px-3 text-[9px] font-semibold tracking-[0.16em] text-[#707384]">{title}</p><div className="space-y-0.5">{navItems.filter((item) => item.group === group).map(({ label, href, icon: Icon }) => { const selected = label === active; return <Link key={href} href={href} aria-current={selected ? "page" : undefined} className={`group flex h-[35px] items-center gap-3 rounded-lg px-3 text-[12px] transition ${selected ? "bg-[#9180ff]/[0.12] font-medium text-[#f2f3f8]" : "text-[#9295a8] hover:bg-white/[0.035] hover:text-[#e4e4ec]"}`}><Icon size={16} strokeWidth={1.7} className={selected ? "text-[#9180ff]" : "text-[#818496] group-hover:text-[#c4c5cf]"} />{label}</Link>; })}</div></section>;
}

export function initials(name: string) { return name.split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase(); }
