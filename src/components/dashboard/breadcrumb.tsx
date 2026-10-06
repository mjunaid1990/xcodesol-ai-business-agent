"use client";

import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { navItems } from "@/components/dashboard/sidebar";

export function Breadcrumb({ workspace, fallback }: { workspace: string; fallback: string }) {
  const pathname = usePathname();
  const label = navItems.find((item) => item.href === pathname)?.label ?? fallback;
  return <div className="flex items-center gap-2 text-[11px]"><span className="text-[#777a8b]">{workspace.toUpperCase()}</span><ChevronRight size={13} className="text-[#555868]" /><span className="font-medium text-[#e8e8ef]">{label === "Activity / Logs" ? "Activity" : label}</span></div>;
}
