import type { Metadata } from "next";
import LegalPage, { Contact, H2 } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Cookie Policy | fdfs.lk",
  description: "The cookies and browser storage fdfs.lk uses, and how to control them.",
  alternates: { canonical: "/cookies" },
};

const TOC = [
  { id: "what", label: "What this covers" },
  { id: "ours", label: "What we store" },
  { id: "third", label: "Third parties" },
  { id: "control", label: "Your controls" },
  { id: "contact", label: "Contact" },
];

const STORAGE = [
  { name: "fdfs-city", purpose: "Remembers the city you chose.", kept: "Until you clear it" },
  { name: "fdfs-saved-movies", purpose: "Movies you saved with the heart button.", kept: "Until you clear it" },
  { name: "fdfs-saved-theatres", purpose: "Theatres you saved with the heart button.", kept: "Until you clear it" },
];

export default function Cookies() {
  return (
    <LegalPage title="Cookie policy" current="/cookies" toc={TOC}>
      <p>This page lists the cookies and similar browser storage used on fdfs.lk, so you know what is on your device and how to remove it.</p>

      <H2 id="what">What this covers</H2>
      <p>A cookie is a small file a website places in your browser. Local storage is similar: a small piece of data kept by your browser for the site. Both can remember choices between visits.</p>

      <H2 id="ours">What we store</H2>
      <p>fdfs.lk sets <strong>no tracking or advertising cookies of its own</strong>. It uses browser local storage for three preferences:</p>
      <div className="mt-4 overflow-x-auto rounded-xl border border-line">
        <table className="w-full min-w-[32rem] text-left text-sm">
          <thead className="bg-surface text-xs uppercase tracking-wider text-muted">
            <tr><th className="p-3">Name</th><th className="p-3">Purpose</th><th className="p-3">Kept</th></tr>
          </thead>
          <tbody className="divide-y divide-line">
            {STORAGE.map((s) => (
              <tr key={s.name}><td className="p-3 font-mono text-xs text-ink">{s.name}</td><td className="p-3">{s.purpose}</td><td className="p-3">{s.kept}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>These are needed for the features you ask for, and they never leave your browser. Our booking-click counts use no cookies or identifiers (see the <a href="/privacy">privacy policy</a>).</p>

      <H2 id="third">Third parties</H2>
      <ul>
        <li><strong>Cloudflare</strong> may set technical cookies to keep the site secure and working, for example to tell real visitors from automated traffic.</li>
        <li><strong>Google AdSense</strong>, when ads are switched on, may set advertising cookies or use similar identifiers to show and measure ads. In regions that require it, Google asks for your consent first.</li>
        <li><strong>YouTube</strong> (youtube-nocookie.com) may set cookies once you press play on a trailer.</li>
        <li>Cinema and ticketing websites you open from fdfs.lk set their own cookies. Check their policies.</li>
      </ul>

      <H2 id="control">Your controls</H2>
      <ul>
        <li>Remove saved items and your city choice by clearing the site&apos;s data in your browser settings.</li>
        <li>Block or delete cookies in your browser settings. The site still works; you may need to choose your city each visit.</li>
        <li>Manage Google ads personalisation at <a href="https://adssettings.google.com" rel="noopener noreferrer">adssettings.google.com</a>.</li>
      </ul>

      <Contact />
    </LegalPage>
  );
}
