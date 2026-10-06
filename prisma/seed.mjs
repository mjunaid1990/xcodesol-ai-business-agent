import prismaPackage from "@prisma/client";

const { PrismaClient } = prismaPackage;

const prisma = new PrismaClient();

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
  console.log(`Seeded ${permissions.length} permissions and ${roleNames.length} roles.`);
} finally {
  await prisma.$disconnect();
}
