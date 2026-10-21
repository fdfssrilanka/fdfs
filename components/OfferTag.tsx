import { Gift } from "lucide-react";
import Link from "next/link";

/**
 * Small "Special Offer" tag for a theatre whose cinema has a current offer. A link to the offers page by default;
 * pass `plain` when it sits inside another link (such as a theatre card) so anchors are never nested.
 */
export default function OfferTag({ className = "", plain = false }: { className?: string; plain?: boolean }) {
  const cls = `inline-flex items-center gap-1 rounded bg-utility px-2 py-1 text-xs font-bold text-white ${className}`;
  const inner = (
    <>
      <Gift className="size-3.5" aria-hidden /> Special Offer
    </>
  );
  return plain ? (
    <span className={cls}>{inner}</span>
  ) : (
    <Link href="/offers" className={`${cls} hover:brightness-110`}>
      {inner}
    </Link>
  );
}
