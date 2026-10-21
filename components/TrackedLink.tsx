"use client";
import { trackClick, type ClickEvent } from "@/lib/track";

type Props = Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "target" | "rel"> & {
  href: string;
  track: Omit<ClickEvent, "url">;
};

/** Outbound link to a cinema's site that records the click (kind, movie, theatre, format, time) before leaving. */
export default function TrackedLink({ href, track, children, onClick, onAuxClick, ...rest }: Props) {
  const fire = () => trackClick({ ...track, url: href });
  return (
    <a
      {...rest}
      href={href}
      target="_blank"
      rel="noopener"
      onClick={(e) => {
        fire();
        onClick?.(e);
      }}
      onAuxClick={(e) => {
        if (e.button === 1) fire();
        onAuxClick?.(e);
      }}
    >
      {children}
    </a>
  );
}
