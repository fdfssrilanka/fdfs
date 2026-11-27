import type { Metadata } from "next";
import Link from "next/link";
import FaqList from "@/components/Faq";
import PageIntro from "@/components/PageIntro";
import { getCities, getTheatresByCity } from "@/lib/data";

export const metadata: Metadata = {
  title: "Cinema Contact Numbers in Sri Lanka – Phone & Address by City | fdfs.lk",
  description: "Phone numbers and addresses for cinemas and film halls in Sri Lanka, by city: Colombo, Kandy, Jaffna, Gampaha, Kurunegala and more. Call to check showtimes or book.",
  alternates: { canonical: "/cinema-contact-numbers" },
};

export default function ContactNumbersPage() {
  const cities = getCities().map((c) => ({ ...c, theatres: getTheatresByCity(c.name).filter((t) => t.phone) })).filter((c) => c.theatres.length);
  const total = cities.reduce((n, c) => n + c.theatres.length, 0);
  const faq = [
    { q: "How do I contact a cinema in Sri Lanka?", a: "Find the cinema under its city on this page and tap the phone number to call. Each cinema's own page also has its address, a map link and its booking site where it has one." },
    { q: "Where do these phone numbers come from?", a: "From each cinema's own website where it has one, otherwise from the National Film Corporation's cinema directory and other public listings. Numbers can change, so tell the cinema if one is out of date." },
    { q: "Can I book movie tickets by phone?", a: "Many independent film halls take bookings and enquiries by phone only. The large chains sell tickets on their own websites, which fdfs.lk links to from every showtime." },
  ];
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <PageIntro h1="Cinema contact numbers in Sri Lanka">
        {`Phone numbers and addresses for ${total} cinemas and film halls in ${cities.length} districts. Call a cinema to ask what's showing or to reserve seats, or open its page for showtimes.`}
      </PageIntro>
      <p className="mb-8 text-sm leading-loose">
        {cities.map((c, i) => (
          <span key={c.slug}>{i > 0 && " · "}<a href={`#${c.slug}`} className="text-link underline underline-offset-2">{c.name}</a></span>
        ))}
      </p>
      {cities.map((c) => (
        <section key={c.slug} id={c.slug} className="mb-8 scroll-mt-24">
          <h2 className="mb-3 text-xl font-extrabold"><Link href={`/cities/${c.slug}`} className="hover:text-accent">Cinemas in {c.name}</Link></h2>
          <div className="overflow-x-auto rounded-xl border border-line">
            <table className="w-full min-w-[34rem] text-left text-sm">
              <thead className="text-xs uppercase tracking-wider text-muted">
                <tr><th className="p-3 font-bold">Cinema</th><th className="p-3 font-bold">Phone</th><th className="p-3 font-bold">Address</th></tr>
              </thead>
              <tbody className="divide-y divide-line">
                {c.theatres.map((t) => (
                  <tr key={t.id}>
                    <td className="p-3 font-semibold"><Link href={`/theatres/${t.slug}`} className="text-link hover:underline">{t.name}</Link></td>
                    <td className="whitespace-nowrap p-3"><a href={`tel:${t.phone}`} className="hover:text-accent">{t.phone}</a></td>
                    <td className="p-3 text-muted">{t.address || t.city}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ))}
      <div className="max-w-3xl"><FaqList faq={faq} /></div>
    </div>
  );
}
