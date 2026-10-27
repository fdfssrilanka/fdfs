# Backend (sample)

Cloudflare D1 database, sign-in with a signed cookie, an admin area and an owner portal. Nothing here is shown on the public site.

- **Set up locally:** `npm run db:migrate`, put `AUTH_SECRET` (32+ random characters) in `.dev.vars`, then `npm run db:seed-admin -- you@example.com 'a long password'`.
- **Production:** `wrangler d1 create fdfs-db`, put the returned id in `wrangler.jsonc`, `npm run db:migrate:remote`, `wrangler secret put AUTH_SECRET`, `npm run db:seed-admin -- <email> <password> --remote`.
- **/login:** admins go to `/admin`, owners to `/owner`.
- **/admin:** click analytics (from `/api/click`), owner accounts and theatre assignment, all owner showtimes, a table browser with edit and delete, and an SQL console (every statement is audit-logged).
- **/owner:** owners add showtimes (several times, repeated for up to 30 days), prices and extra movies for theatres the admin assigned to them.
- Schema: `db/migrations/0001_init.sql`.
