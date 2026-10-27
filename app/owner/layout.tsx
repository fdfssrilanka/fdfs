import type { Metadata } from "next";
import Shell from "@/components/backend/Shell";
import { ownerContext } from "@/lib/backend/owner";

export const metadata: Metadata = { title: "Owner portal | fdfs.lk", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function OwnerLayout({ children }: { children: React.ReactNode }) {
  const { session } = await ownerContext();
  return (
    <Shell session={session} title="Your theatres" nav={[{ href: "/owner", label: "Showtimes & prices" }, { href: "/owner/movies", label: "Add a movie" }]}>
      {children}
    </Shell>
  );
}
