import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/backend/auth";
import LoginForm from "./LoginForm";

export const metadata: Metadata = { title: "Sign in | fdfs.lk", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const s = await getSession();
  if (s) redirect(s.role === "admin" ? "/admin" : "/owner");
  return (
    <div className="mx-auto max-w-sm px-4 py-16">
      <h1 className="font-display text-4xl uppercase leading-none">Sign in</h1>
      <p className="mt-2 text-sm text-muted">For theatre owners and fdfs.lk admins.</p>
      <LoginForm />
    </div>
  );
}
