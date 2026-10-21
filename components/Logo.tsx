import Link from "next/link";

/** fdfs.lk logo: a plain rounded wordmark, "fdfs" in the text colour and ".lk" in the accent colour. */
export default function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" aria-label="fdfs.lk home" className={`inline-flex items-center text-ink ${className}`}>
      <svg viewBox="-2 2 194 54" className="h-8 w-auto" role="img" aria-hidden>
        <g fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="8">
<g stroke="currentColor"><path d="M13 48V21Q13 9 25 9H29"/><path d="M4 28H24"/><circle cx="51" cy="36" r="11.5"/><path d="M62.5 8V48"/><path d="M85 48V21Q85 9 97 9H101"/><path d="M76 28H96"/><path d="M124 29Q121 24 113 24Q104 24 104 31Q104 36 113 37Q123 38 123 43.5Q123 48 114 48Q106 48 102 44"/></g>
<g stroke="var(--accent)"><circle cx="138" cy="45.5" r="2.6" fill="var(--accent)" strokeWidth="3"/><path d="M152 8V48"/><path d="M168 8V48"/><path d="M184 24 168 38"/><path d="M172.5 34 185 48"/></g></g>
      </svg>
    </Link>
  );
}
