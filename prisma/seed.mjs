import prismaPackage from "@prisma/client";
import { hash } from "bcryptjs";

const { PrismaClient } = prismaPackage;

const prisma = new PrismaClient();
const demoAdminEmail = process.env.DEMO_ADMIN_EMAIL ?? "admin@demo.orbitai.com";
const demoAdminPassword = process.env.DEMO_ADMIN_PASSWORD ?? "OrbitAdmin123!";

const permissions = [
  ["View agents", "agents.view"], ["Create agents", "agents.create"], ["Update agents", "agents.update"], ["Delete agents", "agents.delete"], ["Execute agents", "agents.execute"],
  ["View workflows", "workflows.view"], ["Create workflows", "workflows.create"], ["Update workflows", "workflows.update"], ["Delete workflows", "workflows.delete"], ["Execute workflows", "workflows.execute"], ["Publish workflows", "workflows.publish"],
  ["View customers", "customers.view"], ["Create customers", "customers.create"], ["Update customers", "customers.update"], ["Delete customers", "customers.delete"],
  ["View conversations", "conversations.view"], ["Manage conversations", "conversations.manage"],
  ["View knowledge", "knowledge.view"], ["Upload knowledge", "knowledge.upload"], ["Update knowledge", "knowledge.update"], ["Delete knowledge", "knowledge.delete"],
  ["View integrations", "integrations.view"], ["Manage integrations", "integrations.manage"],
  ["View tasks", "tasks.view"], ["Create tasks", "tasks.create"], ["Update tasks", "tasks.update"], ["Approve tasks", "tasks.approve"],
  ["View analytics", "analytics.view"], ["View audit logs", "audit.view"], ["View billing", "billing.view"], ["Manage billing", "billing.manage"], ["View settings", "settings.view"], ["Manage settings", "settings.manage"],
];

const roleNames = ["Owner", "Admin", "Manager", "Member", "Viewer"];
const byRole = {
  Owner: permissions.map(([, slug]) => slug),
  Admin: permissions.map(([, slug]) => slug).filter((slug) => slug !== "billing.manage"),
  Manager: permissions.map(([, slug]) => slug).filter((slug) => /^(agents|workflows|customers|conversations|knowledge|tasks)\./.test(slug) && !/\.(delete)$/.test(slug)),
  Member: permissions.map(([, slug]) => slug).filter((slug) => /\.(view|create|execute|manage|upload|update)$/.test(slug) && /^(agents|workflows|customers|conversations|knowledge|tasks)\./.test(slug)),
  Viewer: permissions.map(([, slug]) => slug).filter((slug) => slug.endsWith(".view")),
};

try {
  if (process.env.NODE_ENV === "production") {
    throw new Error("The demo admin seed is disabled in production.");
  }

  const records = await Promise.all(permissions.map(([name, slug]) => prisma.permission.upsert({ where: { slug }, update: { name }, create: { name, slug } })));
  const permissionBySlug = new Map(records.map((record) => [record.slug, record.id]));
  const roleByName = new Map();
  for (const name of roleNames) {
    let role = await prisma.role.findFirst({ where: { workspaceId: null, slug: name.toLowerCase() } });
    if (!role) role = await prisma.role.create({ data: { name, slug: name.toLowerCase(), description: `${name} workspace role`, isSystem: true } });
    roleByName.set(name, role);
  }
  for (const name of roleNames) {
    const role = roleByName.get(name);
    const data = byRole[name]
      .map((slug) => ({ roleId: role.id, permissionId: permissionBySlug.get(slug) }))
      .filter((assignment) => assignment.permissionId);
    await prisma.rolePermission.createMany({ data, skipDuplicates: true });
  }

  const passwordHash = await hash(demoAdminPassword, 12);
  const workspace = await prisma.workspace.upsert({
    where: { slug: "orbit-demo-workspace" },
    update: {
      name: "Orbit Demo Workspace",
      websiteUrl: "https://example.com",
      industry: "Software",
      companySize: "1-10",
      timezone: "Asia/Karachi",
      currency: "USD",
      status: "active",
      onboardingCompletedAt: new Date(),
    },
    create: {
      name: "Orbit Demo Workspace",
      slug: "orbit-demo-workspace",
      websiteUrl: "https://example.com",
      industry: "Software",
      companySize: "1-10",
      timezone: "Asia/Karachi",
      currency: "USD",
      status: "active",
      onboardingCompletedAt: new Date(),
    },
  });
  const user = await prisma.user.upsert({
    where: { email: demoAdminEmail },
    update: {
      name: "Alex Morgan",
      emailVerifiedAt: new Date(),
      passwordHash,
      timezone: "Asia/Karachi",
      locale: "en",
    },
    create: {
      name: "Alex Morgan",
      email: demoAdminEmail,
      emailVerifiedAt: new Date(),
      passwordHash,
      timezone: "Asia/Karachi",
      locale: "en",
    },
  });
  await prisma.workspaceUser.upsert({
    where: { workspaceId_userId: { workspaceId: workspace.id, userId: user.id } },
    update: { role: "owner", status: "active", joinedAt: new Date() },
    create: { workspaceId: workspace.id, userId: user.id, role: "owner", status: "active", joinedAt: new Date() },
  });

  console.log(`Seeded ${permissions.length} permissions, ${roleNames.length} roles, and demo admin ${demoAdminEmail}.`);
} finally {
  await prisma.$disconnect();
}
