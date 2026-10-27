"use client";

import { useActionState } from "react";
import { login } from "./actions";

export default function LoginForm() {
  const [state, action, pending] = useActionState(login, undefined);
  const field = "mt-1 block min-h-11 w-full border border-line bg-surface-2 px-3 text-base text-ink outline-none focus:border-accent";
  return (
    <form action={action} className="mt-6 space-y-4">
      <label className="block text-sm font-semibold">Email
        <input name="email" type="email" required autoComplete="username" className={field} />
      </label>
      <label className="block text-sm font-semibold">Password
        <input name="password" type="password" required autoComplete="current-password" className={field} />
      </label>
      {state?.error && <p role="alert" className="text-sm font-semibold text-accent">{state.error}</p>}
      <button disabled={pending} className="min-h-11 w-full bg-accent px-4 text-sm font-extrabold text-accent-ink disabled:opacity-60">{pending ? "Signing in…" : "Sign in"}</button>
    </form>
  );
}
