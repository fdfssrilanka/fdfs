"use client";
import { Check, Share2 } from "lucide-react";
import { useState } from "react";

export default function ShareButton({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);
  const share = async () => {
    const url = location.href;
    try {
      if (navigator.share) return await navigator.share({ title, url });
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };
  return (
    <button onClick={share} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/40 px-4 text-sm sm:px-6 font-bold hover:border-accent hover:text-accent">
      {copied ? <Check className="size-4" aria-hidden /> : <Share2 className="size-4" aria-hidden />} {copied ? "Link copied" : "Share"}
    </button>
  );
}
