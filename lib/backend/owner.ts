import { redirect } from "next/navigation";
import { requireOwner, type Session } from "./auth";
import { rows } from "./db";
import { getMovies, getTheatreById } from "@/lib/data";

export const FORMATS = ["2D", "3D", "IMAX", "Dolby Atmos", "Gold Class", "Luxe", "Platinum", "4DX"];

/** The signed-in owner plus the theatres they may manage. Admins are sent to /admin. */
export async function ownerContext(): Promise<{ session: Session; theatres: { id: string; name: string }[] }> {
  const session = await requireOwner();
  if (session.role === "admin") redirect("/admin");
  const links = await rows<{ theatre_id: string }>("SELECT theatre_id FROM owner_theatres WHERE user_id = ?", session.id);
  return { session, theatres: links.map((l) => ({ id: l.theatre_id, name: getTheatreById(l.theatre_id)?.name ?? l.theatre_id })) };
}

export async function movieChoices() {
  const custom = await rows<{ id: string; title: string; language: string }>("SELECT id, title, language FROM custom_movies ORDER BY title");
  return [
    ...getMovies().filter((m) => m.status === "now_showing").map((m) => ({ id: m.id, label: `${m.title} (${m.language})` })),
    ...custom.map((m) => ({ id: m.id, label: `${m.title}${m.language ? ` (${m.language})` : ""} · added by owner` })),
  ].sort((a, b) => a.label.localeCompare(b.label));
}
