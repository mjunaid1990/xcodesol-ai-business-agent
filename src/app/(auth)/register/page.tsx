import { redirect } from "next/navigation";
import { getCurrentContext } from "@/lib/auth/current-user";
import { registerAction } from "@/app/auth-actions";
import { AuthForm } from "../auth-form";
import Link from "next/link";

export default async function RegisterPage() {
  if (await getCurrentContext()) redirect("/dashboard");
  return <main className="grid min-h-screen lg:grid-cols-[1fr_1fr]">
    <section className="relative hidden overflow-hidden border-r border-[#262833] bg-[#101118] p-12 lg:flex lg:flex-col lg:justify-between"><Link href="/" className="flex w-fit items-center gap-2.5"><div className="grid h-8 w-8 place-items-center rounded-[10px] bg-gradient-to-br from-[#a69aff] to-[#6d5ce7] text-[15px] font-bold">o</div><span className="text-[17px] font-semibold">orbit <span className="text-[#9c8cff]">/ AI</span></span></Link><div className="max-w-lg"><p className="text-sm font-medium text-[#a99cff]">YOUR AI WORKFORCE STARTS HERE</p><h1 className="mt-5 text-5xl font-semibold leading-tight tracking-[-0.04em]">Turn business<br />processes into<br /><span className="text-[#a99cff]">real progress.</span></h1><p className="mt-6 max-w-md leading-7 text-[#9295a8]">Create a workspace for your team. Add AI employees as you’re ready, and keep people in control of every important decision.</p></div><p className="text-xs text-[#656879]">© 2026 orbit / AI · Business Agent Platform</p></section>
    <section className="flex items-center justify-center px-6 py-12"><div className="w-full max-w-[400px]"><div className="mb-12 lg:hidden"><Link href="/" className="text-lg font-semibold">orbit <span className="text-[#9c8cff]">/ AI</span></Link></div><p className="text-[11px] font-semibold tracking-[0.17em] text-[#a99cff]">GET STARTED</p><h2 className="mt-3 text-[29px] font-semibold tracking-[-0.035em]">Create your workspace</h2><p className="mt-2 text-sm text-[#9295a8]">Set up your account and invite your team later.</p><div className="mt-8"><AuthForm mode="register" action={registerAction} /></div><p className="mt-7 text-center text-sm text-[#85889a]">Already have an account? <Link className="font-medium text-[#b4a8ff] hover:text-white" href="/login">Sign in</Link></p></div></section>
  </main>;
}
