"use client";

import { useActionState } from "react";
import { btn, input } from "@/components/backend/Shell";
import { createOwner } from "./actions";

export default function CreateOwnerForm() {
  const [state, action, pending] = useActionState(createOwner, undefined);
  return (
    <form action={action} className="mt-3 grid gap-2 md:grid-cols-5">
      <input name="name" placeholder="Name" className={input} />
      <input name="email" type="email" required placeholder="Email" className={input} />
      <input name="password" type="text" required minLength={10} placeholder="Password (10+ chars)" autoComplete="off" className={input} />
      <input name="theatre" list="theatre-options" placeholder="First theatre…" className={input} />
      <button disabled={pending} className={btn}>{pending ? "Creating…" : "Create owner"}</button>
      {state?.error && <p role="alert" className="text-sm font-semibold text-accent md:col-span-5">{state.error}</p>}
      {state?.ok && <p className="text-sm font-semibold text-green md:col-span-5">{state.ok}</p>}
    </form>
  );
}
