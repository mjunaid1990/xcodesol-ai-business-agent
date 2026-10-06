import { notFound } from "next/navigation";
import { navItems } from "@/components/dashboard/sidebar";
import { WorkspaceModule } from "@/components/dashboard/workspace-module";

export function generateStaticParams() { return navItems.filter((item) => item.href !== "/dashboard").map(({ href }) => ({ section: href.slice(1) })); }

export default async function SectionPage({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;
  const item = navItems.find((entry) => entry.href === `/${section}`);
  if (!item) notFound();
  return <WorkspaceModule section={item.label} />;
}
