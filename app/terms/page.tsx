import type { Metadata } from "next";
import LegalPage, { Contact, H2 } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Terms of Use | fdfs.lk",
  description: "The terms for using fdfs.lk: showtimes are collected from cinema websites, we don't sell tickets, and what you can expect from the site.",
  alternates: { canonical: "/terms" },
};

const TOC = [
  { id: "about", label: "What fdfs.lk is" },
  { id: "accuracy", label: "Accuracy of showtimes" },
  { id: "tickets", label: "Tickets and bookings" },
  { id: "use", label: "Using the site" },
  { id: "content", label: "Content and trademarks" },
  { id: "ads", label: "Ads and links" },
  { id: "liability", label: "Liability" },
  { id: "changes", label: "Changes" },
  { id: "law", label: "Governing law" },
  { id: "contact", label: "Contact" },
];

export default function Terms() {
  return (
    <LegalPage title="Terms of use" current="/terms" toc={TOC}>
      <p>By using fdfs.lk you agree to these terms. If you don&apos;t agree, please don&apos;t use the site.</p>

      <H2 id="about">What fdfs.lk is</H2>
      <p>fdfs.lk is an information service that lists movies, cinemas and showtimes in Sri Lanka and links to cinemas&apos; own websites. We are not a cinema, a ticket seller or an agent of any cinema, and we are not affiliated with the cinemas, chains or ticketing services we mention.</p>

      <H2 id="accuracy">Accuracy of showtimes</H2>
      <ul>
        <li>Showtimes, formats, offers, addresses and phone numbers are collected from cinemas&apos; public websites and from public directories. They can be wrong, late or out of date, and cinemas can change or cancel shows at any time.</li>
        <li>Cinemas listed from a directory, with no online showtimes, may have closed or changed. Confirm with the cinema before you travel.</li>
        <li>Distances and the city we suggest are approximate.</li>
        <li>The cinema&apos;s own page is the final word on times, prices, seats and offers.</li>
      </ul>

      <H2 id="tickets">Tickets and bookings</H2>
      <p>We don&apos;t sell tickets and we don&apos;t take payment. When you tap a showtime or booking button you leave fdfs.lk for the cinema&apos;s or ticketing service&apos;s website, and your booking is a contract between you and them. Refunds, changes, prices, fees and seat choices are their responsibility. Ticket prices are not shown on fdfs.lk.</p>

      <H2 id="use">Using the site</H2>
      <p>You may use fdfs.lk for personal, non-commercial purposes. Please don&apos;t:</p>
      <ul>
        <li>copy the site&apos;s content in bulk, or use automated tools that put unreasonable load on it;</li>
        <li>try to break, probe or overload the site or its services;</li>
        <li>use it in any way that is unlawful or that infringes anyone&apos;s rights.</li>
      </ul>

      <H2 id="content">Content and trademarks</H2>
      <p>Movie titles, posters, trailers, cinema names, logos and offers belong to their owners and are shown to help you find a movie or cinema. They are used for identification only and don&apos;t imply endorsement. The fdfs.lk name, design and the way our information is arranged belong to us. If you are a rights holder and want something changed or removed, contact us.</p>

      <H2 id="ads">Ads and links</H2>
      <p>fdfs.lk may show advertising. Ads and links to other websites are not under our control, and we aren&apos;t responsible for the content, offers or practices of the sites they lead to.</p>

      <H2 id="liability">Liability</H2>
      <p>The site is provided &ldquo;as is&rdquo;, without promises that it will always be available, accurate or error-free. To the fullest extent the law allows, we are not liable for any loss arising from using the site or relying on its information, including a missed or cancelled show, a wrong time or price, or a problem with a booking made on another website. Nothing in these terms limits liability that cannot be limited by law.</p>

      <H2 id="changes">Changes</H2>
      <p>We may update these terms, and the date at the top will change when we do. Continuing to use the site after an update means you accept it.</p>

      <H2 id="law">Governing law</H2>
      <p>These terms are governed by the laws of Sri Lanka, and the courts of Sri Lanka have jurisdiction over any dispute, unless the law where you live gives you rights that can&apos;t be waived.</p>

      <Contact />
    </LegalPage>
  );
}
