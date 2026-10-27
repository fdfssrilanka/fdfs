import type { Metadata } from "next";
import Shell from "@/components/backend/Shell";
import { requireAdmin } from "@/lib/backend/auth";

export const metadata: Metadata = { title: "Admin | fdfs.lk", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdmin();
  return (
    <Shell
      session={session}
      title="Dashboard"
      nav={[
        { href: "/admin", label: "Analytics" },
        { href: "/admin/owners", label: "Owners" },
        { href: "/admin/showtimes", label: "Owner showtimes" },
        { href: "/admin/database", label: "Database" },
      ]}
    >
      {children}
    </Shell>
  );
}
