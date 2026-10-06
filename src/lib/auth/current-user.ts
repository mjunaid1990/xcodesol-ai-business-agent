import { cache } from "react";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { readSession } from "@/lib/auth/session";

export const getCurrentContext = cache(async () => {
  const session = await readSession();
  if (!session) return null;
  const membership = await db.workspaceUser.findFirst({
    where: { userId: session.userId, workspaceId: session.workspaceId, status: "active" },
    include: { user: true, workspace: true },
  });
  return membership ?? null;
});

export async function requireCurrentContext() {
  const context = await getCurrentContext();
  if (!context) redirect("/login");
  return context;
}
