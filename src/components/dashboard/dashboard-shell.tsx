import Link from "next/link";
import { Bell, Plus, Search } from "lucide-react";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Breadcrumb } from "@/components/dashboard/breadcrumb";

type Context = { workspace: { id: string; name: string }; user: { id: string; name: string; email: string; role: string }; workspaces: { id: string; name: string }[] };

export function DashboardShell({ context, active = "Dashboard", children }: { context: Context; active?: string; children: React.ReactNode }) {
  const initials = context.user.name.split(/\s+/).slice(0, 2).map((name) => name[0]).join("").toUpperCase();
  return <div className="min-h-screen bg-[#0c0d12]"><Sidebar {...context} active={active} /><div className="lg:pl-[232px]"><header className="sticky top-0 z-20 flex h-[62px] items-center justify-between border-b border-[#262833] bg-[#0c0d12]/90 px-5 backdrop-blur-xl md:px-8"><Breadcrumb workspace={context.workspace.name} fallback={active} /><div className="flex items-center gap-2"><button aria-label="Search" className="hidden h-8 items-center gap-2 rounded-md border border-[#292b36] px-2.5 text-xs text-[#85889a] sm:flex"><Search size={13} /><span>Search</span><kbd className="ml-8 rounded border border-[#31333e] px-1 text-[9px]">⌘ K</kbd></button><button aria-label="Notifications" className="grid h-8 w-8 place-items-center rounded-md text-[#888b9c] hover:bg-white/5"><Bell size={16} /></button><div className="ml-1 grid h-7 w-7 place-items-center rounded-full bg-[#373447] text-[9px] font-semibold text-[#d9d2ff]">{initials}</div></div></header>{children}</div></div>;
}

export function PageHeading({ title, description, primary, secondary, primaryHref, secondaryHref }: { title: string; description: string; primary?: string; secondary?: string; primaryHref?: string; secondaryHref?: string }) {
  return <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><h1 className="text-[27px] font-semibold leading-tight tracking-[-0.04em] text-[#f2f3f8]">{title}</h1><p className="mt-2 text-[13px] text-[#9295a8]">{description}</p></div><div className="flex gap-2">{secondary && (secondaryHref ? <Link href={secondaryHref} className="rounded-lg border border-[#30313d] bg-[#14151d] px-3.5 py-2.5 text-xs font-medium text-[#d5d6df] hover:border-[#4a4b59]">{secondary}</Link> : <button disabled title="Available in a later phase" className="cursor-not-allowed rounded-lg border border-[#30313d] bg-[#14151d] px-3.5 py-2.5 text-xs font-medium text-[#777a8b]">{secondary}</button>)}{primary && (primaryHref ? <Link href={primaryHref} className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#6960ed] to-[#9060ed] px-3.5 py-2.5 text-xs font-semibold text-white shadow-[0_6px_18px_#7566ed26] hover:brightness-110"><Plus size={14} />{primary}</Link> : <button disabled title="Available in a later phase" className="inline-flex cursor-not-allowed items-center gap-2 rounded-lg bg-[#34333f] px-3.5 py-2.5 text-xs font-semibold text-[#9493a2]"><Plus size={14} />{primary}</button>)}</div></div>;
}

export function Panel({ title, action, actionHref, children, className = "" }: { title: string; action?: string; actionHref?: string; children: React.ReactNode; className?: string }) {
  return <section className={`rounded-xl border border-[#262833] bg-[#14151d] ${className}`}><div className="flex items-center justify-between border-b border-[#252630] px-4 py-3.5"><h2 className="text-xs font-semibold text-[#e8e8ef]">{title}</h2>{action && (actionHref ? <Link href={actionHref} className="text-[10px] font-medium text-[#a89cff] hover:text-white">{action}<span className="pl-1">↗</span></Link> : <span className="text-[10px] text-[#696c7d]">{action}</span>)}</div>{children}</section>;
}
