"use client";

import { useActionState } from "react";
import type { AuthState } from "@/app/auth-actions";

type Props = { mode: "login" | "register"; action: (state: AuthState, data: FormData) => Promise<AuthState> };

export function AuthForm({ mode, action }: Props) {
  const [state, formAction, pending] = useActionState(action, {});
  const register = mode === "register";
  return (
    <form action={formAction} className="space-y-4">
      {register && <Field label="Your name" name="name" placeholder="Alex Morgan" autoComplete="name" />}
      <Field label="Work email" name="email" placeholder="you@company.com" type="email" autoComplete="email" />
      <Field label="Password" name="password" placeholder="At least 10 characters" type="password" autoComplete={register ? "new-password" : "current-password"} />
      {register && <Field label="Workspace name" name="workspace" placeholder="Forma Studio" />}
      {state.error && <p role="alert" className="rounded-lg border border-rose-400/20 bg-rose-400/[0.07] px-3 py-2.5 text-sm text-rose-200">{state.error}</p>}
      <button disabled={pending} className="mt-2 w-full rounded-lg bg-gradient-to-r from-[#6960ed] to-[#9060ed] px-4 py-3 text-sm font-semibold text-white shadow-[0_8px_28px_#7464ef33] transition hover:brightness-110 disabled:opacity-60">
        {pending ? "Please wait…" : register ? "Create account" : "Sign in"}
      </button>
      {register && <p className="text-center text-xs leading-5 text-[#777b8d]">By creating an account, you agree to the workspace terms and privacy policy.</p>}
    </form>
  );
}

function Field({ label, name, ...props }: { label: string; name: string; placeholder?: string; type?: string; autoComplete?: string }) {
  return <label className="block space-y-2"><span className="text-sm font-medium text-[#c9cad4]">{label}</span><input required name={name} {...props} className="w-full rounded-lg border border-[#292b37] bg-[#0e0f15] px-3.5 py-3 text-sm text-[#f2f3f8] outline-none placeholder:text-[#626575] focus:border-[#9180ff]/70 focus:ring-2 focus:ring-[#9180ff]/10" /></label>;
}
