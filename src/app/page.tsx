import { redirect } from "next/navigation";
import { getCurrentContext } from "@/lib/auth/current-user";

export default async function Home() {
  const context = await getCurrentContext();
  redirect(context ? "/dashboard" : "/login");
}
