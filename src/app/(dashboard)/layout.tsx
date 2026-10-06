import { requireCurrentContext } from "@/lib/auth/current-user";
import { db } from "@/lib/db";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const context = await requireCurrentContext();
  const memberships = await db.workspaceUser.findMany({ where: { userId: context.userId, status: "active" }, include: { workspace: { select: { id: true, name: true } } }, orderBy: { createdAt: "asc" } });
  return <DashboardShell context={{ workspace: { id: context.workspace.id, name: context.workspace.name }, user: { id: context.user.id, name: context.user.name, email: context.user.email, role: context.role }, workspaces: memberships.map(({ workspace }) => workspace) }}>{children}</DashboardShell>;
}
