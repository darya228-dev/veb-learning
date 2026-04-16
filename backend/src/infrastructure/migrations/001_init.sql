CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS tasks (
  id TEXT PRIMARY KEY,
  subject TEXT NOT NULL,
  status TEXT NOT NULL CHECK(status IN ('Technical','Physical','Undefined')),
  priority TEXT CHECK(priority IN ('Low','Medium','High')),
  message TEXT,
  author TEXT,
  userId TEXT,
  projectId TEXT,
  FOREIGN KEY(userId) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY(projectId) REFERENCES projects(id ON DELETE CASCADE)
);