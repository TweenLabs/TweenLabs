import { isAuthenticated } from "@/lib/auth-server";
import { redirect } from "next/navigation";
import AdminDashboard from "./AdminClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin Dashboard | TweenLabs",
  description: "Analytics and site management dashboard.",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const authenticated = await isAuthenticated();

  if (!authenticated) {
    redirect("/components?login=true");
  }

  return <AdminDashboard />;
}
