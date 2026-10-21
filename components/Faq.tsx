import type { Faq } from "@/lib/seo";
import JsonLd from "./JsonLd";
import { faqJsonLd } from "@/lib/seo";

export default function FaqList({ faq, title = "Frequently asked questions" }: { faq: Faq[]; title?: string }) {
  if (!faq.length) return null;
  return (
    <section aria-labelledby="faq">
      <JsonLd data={faqJsonLd(faq)} />
      <h2 id="faq" className="mb-3 text-base font-extrabold uppercase tracking-wide sm:text-lg">{title}</h2>
      <div className="divide-y divide-line rounded-xl border border-line">
        {faq.map((f) => (
          <div key={f.q} className="p-4 sm:px-5">
            <h3 className="text-sm font-bold">{f.q}</h3>
            <p className="mt-1 text-sm text-ink/80">{f.a}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
