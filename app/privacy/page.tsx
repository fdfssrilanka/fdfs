import type { Metadata } from "next";
import LegalPage, { Contact, H2 } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy | fdfs.lk",
  description: "How fdfs.lk handles your location, saved items and booking clicks. No accounts, no tracking cookies of our own.",
  alternates: { canonical: "/privacy" },
};

const TOC = [
  { id: "summary", label: "In short" },
  { id: "collect", label: "What we collect" },
  { id: "location", label: "Your location" },
  { id: "browser", label: "Saved in your browser" },
  { id: "clicks", label: "Booking clicks" },
  { id: "partners", label: "Services we use" },
  { id: "links", label: "Other websites" },
  { id: "rights", label: "Your choices" },
  { id: "changes", label: "Changes" },
  { id: "contact", label: "Contact" },
];

export default function Privacy() {
  return (
    <LegalPage title="Privacy policy" current="/privacy" toc={TOC}>
      <p>This policy explains what fdfs.lk (&ldquo;we&rdquo;, &ldquo;us&rdquo;) does with information when you use the website. We keep it to the minimum needed to show you cinemas and showtimes.</p>

      <H2 id="summary">In short</H2>
      <ul>
        <li>There are no accounts, and we don&apos;t ask for your name, email or phone number to use the site.</li>
        <li>Your location is used in your browser to choose a city and sort cinemas. We don&apos;t store it.</li>
        <li>Saved movies and theatres stay in your browser.</li>
        <li>We count booking clicks anonymously, to see which showtimes people use. No cookies and no personal details.</li>
        <li>We don&apos;t sell tickets and we don&apos;t sell your data.</li>
      </ul>

      <H2 id="collect">What we collect</H2>
      <p>We don&apos;t collect personal details directly. When your browser asks for a page, our hosting provider (Cloudflare) necessarily sees technical information such as your IP address and browser type in order to deliver the site and protect it from abuse. We don&apos;t use that to identify you or to build a profile.</p>

      <H2 id="location">Your location</H2>
      <ul>
        <li><strong>Approximate location.</strong> On your first visit the site asks our server for your approximate location, which Cloudflare works out from your connection (country and rough position). The server returns it to your browser and keeps nothing. Your browser uses it only to pick the nearest city. If you are outside Sri Lanka, nothing changes.</li>
        <li><strong>Precise location.</strong> Only if you tap <em>Use my location</em> does your browser ask for permission. If you allow it, the position is used inside your browser to find the nearest city and sort theatres. It is not sent to us.</li>
        <li>You can pick a city yourself at any time, and refuse or withdraw the browser&apos;s location permission in your browser settings.</li>
      </ul>

      <H2 id="browser">Saved in your browser</H2>
      <p>The site stores a few preferences in your browser&apos;s local storage: the city you chose, and the movies and theatres you saved with the heart button. This stays on your device. We can&apos;t see it, and clearing your browser data removes it. See the <a href="/cookies">cookie policy</a> for the exact items.</p>

      <H2 id="clicks">Booking clicks</H2>
      <p>When you tap a showtime, a Book button, an offer, or a link that takes you to a cinema&apos;s website, we record a simple count: the type of link, the movie and theatre, the format, date and time, the destination website, the page you were on, and your country. We do not record your IP address, and we use no cookies or identifiers for this. The counts are stored with Cloudflare Workers Analytics Engine and are used only to understand which showtimes are useful.</p>

      <H2 id="partners">Services we use</H2>
      <ul>
        <li><strong>Cloudflare</strong> hosts and delivers the site and provides the approximate location. See Cloudflare&apos;s privacy policy.</li>
        <li><strong>Google AdSense</strong> may show ads when enabled. Google may use cookies or similar technology to choose and measure ads, and in some regions asks for your consent first. See Google&apos;s advertising policy and the <a href="/cookies">cookie policy</a>.</li>
        <li><strong>YouTube</strong> trailers load from youtube-nocookie.com only when you press play. YouTube then receives the usual request information.</li>
        <li><strong>Google Maps</strong> opens in a new tab when you tap View map. We don&apos;t embed it.</li>
      </ul>

      <H2 id="links">Other websites</H2>
      <p>Showtimes link to the cinemas&apos; own booking pages, and offers link to the cinemas&apos; own offer pages. Those sites have their own privacy practices, and what you enter there (such as payment details) goes to them, not to us.</p>

      <H2 id="rights">Your choices</H2>
      <ul>
        <li>Clear your browser&apos;s site data to remove saved items and your city choice.</li>
        <li>Block or limit cookies in your browser settings.</li>
        <li>Because we hold no personal profile about you, there is normally nothing for us to access, correct or delete. If you think we hold something about you, contact us and we&apos;ll look into it.</li>
      </ul>
      <p>The site is not directed at children, and we do not knowingly collect information from them.</p>

      <H2 id="changes">Changes</H2>
      <p>If we change how we handle information, we&apos;ll update this page and its date. Please check it from time to time.</p>

      <Contact />
    </LegalPage>
  );
}
