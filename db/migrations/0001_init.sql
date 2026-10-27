-- fdfs.lk backend: accounts, owner showtimes, click tracking, audit log.

CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL UNIQUE COLLATE NOCASE,
  name TEXT NOT NULL DEFAULT '',
  role TEXT NOT NULL CHECK (role IN ('admin', 'owner')),
  password_hash TEXT NOT NULL,
  disabled INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  last_login_at TEXT
);

-- Which theatres (ids from data/theatres.json) an owner may manage.
CREATE TABLE owner_theatres (
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  theatre_id TEXT NOT NULL,
  PRIMARY KEY (user_id, theatre_id)
);

-- Movies an owner adds that are not in the scraped catalogue.
CREATE TABLE custom_movies (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  language TEXT NOT NULL DEFAULT '',
  genres TEXT NOT NULL DEFAULT '',
  runtime_min INTEGER,
  poster_url TEXT NOT NULL DEFAULT '',
  created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Showtimes entered by theatre owners. movie_id is a catalogue id or a custom_movies id.
CREATE TABLE owner_showtimes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  theatre_id TEXT NOT NULL,
  movie_id TEXT NOT NULL,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  format TEXT NOT NULL DEFAULT '2D',
  price_lkr INTEGER,
  booking_url TEXT NOT NULL DEFAULT '',
  created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX idx_owner_showtimes_theatre_date ON owner_showtimes (theatre_id, date);

CREATE TABLE clicks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ts TEXT NOT NULL DEFAULT (datetime('now')),
  kind TEXT NOT NULL,
  movie_id TEXT NOT NULL DEFAULT '',
  theatre_id TEXT NOT NULL DEFAULT '',
  cinema_id TEXT NOT NULL DEFAULT '',
  host TEXT NOT NULL DEFAULT '',
  format TEXT NOT NULL DEFAULT '',
  show_date TEXT NOT NULL DEFAULT '',
  show_time TEXT NOT NULL DEFAULT '',
  page TEXT NOT NULL DEFAULT '',
  country TEXT NOT NULL DEFAULT ''
);
CREATE INDEX idx_clicks_ts ON clicks (ts);

CREATE TABLE login_attempts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL,
  ts TEXT NOT NULL DEFAULT (datetime('now')),
  ok INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX idx_login_attempts ON login_attempts (email, ts);

CREATE TABLE audit_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ts TEXT NOT NULL DEFAULT (datetime('now')),
  user_id INTEGER,
  user_email TEXT NOT NULL DEFAULT '',
  action TEXT NOT NULL,
  detail TEXT NOT NULL DEFAULT ''
);
