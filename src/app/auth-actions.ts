"use server";

import { z } from "zod";
import { compare, hash } from "bcryptjs";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { clearSession, createSession, readSession } from "@/lib/auth/session";

const credentialsSchema = z.object({
  name: z.string().trim().min(2).max(80).optional(),
  email: z.string().trim().email().max(254),
  password: z.string().min(10).max(128),
  workspace: z.string().trim().min(2).max(80).optional(),
});

export type AuthState = { error?: string };

function workspaceSlug(name: string) {
  const base = name.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 48) || "workspace";
  return `${base}-${crypto.randomUUID().slice(0, 8)}`;
}

export async function registerAction(_state: AuthState, formData: FormData): Promise<AuthState> {
  const parsed = credentialsSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success || !parsed.data.name || !parsed.data.workspace) return { error: "Enter your name, a valid email, a password of at least 10 characters, and a workspace name." };
  const { name, email, password, workspace } = parsed.data;
  const normalizedEmail = email.toLowerCase();
  const existing = await db.user.findUnique({ where: { email: normalizedEmail }, select: { id: true } });
  if (existing) return { error: "An account with this email already exists. Sign in instead." };

  const passwordHash = await hash(password, 12);
  const created = await db.$transaction(async (tx) => {
    const user = await tx.user.create({ data: { name, email: normalizedEmail, passwordHash } });
    const newWorkspace = await tx.workspace.create({ data: { name: workspace, slug: workspaceSlug(workspace) } });
    await tx.workspaceUser.create({ data: { userId: user.id, workspaceId: newWorkspace.id, role: "owner", joinedAt: new Date() } });
    return { userId: user.id, workspaceId: newWorkspace.id };
  });
  await createSession(created);
  redirect("/dashboard");
}

export async function loginAction(_state: AuthState, formData: FormData): Promise<AuthState> {
  const parsed = credentialsSchema.pick({ email: true, password: true }).safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: "Enter a valid email and password." };
  const email = parsed.data.email.toLowerCase();
  const user = await db.user.findUnique({ where: { email } });
  if (!user?.passwordHash || !(await compare(parsed.data.password, user.passwordHash))) return { error: "Email or password is incorrect." };
  const membership = await db.workspaceUser.findFirst({
    where: { userId: user.id, status: "active" },
    orderBy: { createdAt: "asc" },
    select: { workspaceId: true },
  });
  if (!membership) return { error: "Your account does not have an active workspace. Contact your workspace owner." };
  await db.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
  await createSession({ userId: user.id, workspaceId: membership.workspaceId });
  redirect("/dashboard");
}

export async function logoutAction() {
  await clearSession();
  redirect("/login");
}

export async function switchWorkspaceAction(formData: FormData) {
  const workspaceId = formData.get("workspaceId");
  const session = await readSession();
  if (typeof workspaceId !== "string" || !session) redirect("/login");
  const membership = await db.workspaceUser.findFirst({
    where: { workspaceId, userId: session.userId, status: "active" },
    select: { workspaceId: true },
  });
  if (!membership) redirect("/dashboard");
  await createSession({ userId: session.userId, workspaceId: membership.workspaceId });
  redirect("/dashboard");
}
