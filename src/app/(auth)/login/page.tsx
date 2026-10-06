import Link from "next/link";
import { redirect } from "next/navigation";
import { loginAction, registerAction } from "@/app/auth-actions";
import { AuthForm } from "../auth-form";
import { getCurrentContext } from "@/lib/auth/current-user";

export default async function LoginPage() {
  if (await getCurrentContext()) redirect("/dashboard");
  return <AuthPage eyebrow="WELCOME BACK" title="Sign in to your workspace" intro="Your AI workforce is ready when you are." mode="login" footer={<>New to orbit / AI? <Link className="font-medium text-[#b4a8ff] hover:text-white" href="/register">Create an account</Link></>} />;
}

function AuthPage({ eyebrow, title, intro, mode, footer }: { eyebrow: string; title: string; intro: string; mode: "login" | "register"; footer: React.ReactNode }) {
  return <main className="grid min-h-screen lg:grid-cols-[1fr_1fr]">
    <section className="relative hidden overflow-hidden border-r border-[#262833] bg-[#101118] p-12 lg:flex lg:flex-col lg:justify-between">
      <div className="absolute -left-36 top-1/4 h-[500px] w-[500px] rounded-full bg-[#6958d8]/10 blur-[110px]" />
      <Brand />
      <div className="relative max-w-xl pb-12"><div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#9180ff]/20 bg-[#9180ff]/[0.07] px-3 py-1.5 text-xs text-[#c4baff]"><span className="h-1.5 w-1.5 rounded-full bg-[#9180ff]" /> AI workforce control center</div><h1 className="text-5xl font-semibold leading-[1.12] tracking-[-0.04em]">Make room for<br /><span className="bg-gradient-to-r from-[#b6aaff] to-[#806eef] bg-clip-text text-transparent">work that matters.</span></h1><p className="mt-6 max-w-md text-base leading-7 text-[#9295a8]">Build AI agents that know your business, handle the busywork, and bring you in when it matters.</p><div className="mt-10 flex items-center gap-4"><div className="flex -space-x-2">{["AM", "JL", "CW"].map((name, i) => <div key={name} className={`grid h-9 w-9 place-items-center rounded-full border-2 border-[#101118] text-[10px] font-semibold ${["bg-[#383448]", "bg-[#324149]", "bg-[#493e3b]"][i]}`}>{name}</div>)}</div><div><p className="text-sm text-[#d9dae2]">A smarter way to work</p><p className="mt-0.5 text-xs text-[#777b8d]">People and AI, working together</p></div></div></div>
      <p className="relative text-xs text-[#656879]">© 2026 orbit / AI · Business Agent Platform</p>
    </section>
    <section className="flex items-center justify-center px-6 py-12"><div className="w-full max-w-[400px]"><div className="mb-12 lg:hidden"><Brand /></div><p className="text-[11px] font-semibold tracking-[0.17em] text-[#a99cff]">{eyebrow}</p><h2 className="mt-3 text-[29px] font-semibold tracking-[-0.035em]">{title}</h2><p className="mt-2 text-sm text-[#9295a8]">{intro}</p><div className="mt-8"><AuthForm mode={mode} action={mode === "login" ? loginAction : registerAction} /></div><p className="mt-7 text-center text-sm text-[#85889a]">{footer}</p></div></section>
  </main>;
}

function Brand() { return <Link href="/" className="relative flex w-fit items-center gap-2.5"><div className="grid h-8 w-8 place-items-center rounded-[10px] bg-gradient-to-br from-[#a69aff] to-[#6d5ce7] text-[15px] font-bold text-white shadow-[0_4px_18px_#8070f044]">o</div><span className="text-[17px] font-semibold tracking-[-0.04em]">orbit <span className="text-[#9c8cff]">/ AI</span></span></Link>; }
