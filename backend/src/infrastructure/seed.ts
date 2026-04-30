import { db } from "./db";

export function seed() {
  console.log("Seeding database...");

  db.serialize(() => {
    console.log("Seeding users...");

    db.run(`INSERT OR IGNORE INTO users (id, name) VALUES ('1', 'Admin')`);
    db.run(`INSERT OR IGNORE INTO users (id, name) VALUES ('2', 'John')`);

    console.log("Seeding projects...");

    db.run(`INSERT OR IGNORE INTO projects (id, name) VALUES ('1', 'Test Project')`);
    db.run(`INSERT OR IGNORE INTO projects (id, name) VALUES ('2', 'Backend App')`);

    console.log("Seeding tasks...");

    db.run(`
      INSERT OR IGNORE INTO tasks (id, subject, status, priority, userId, projectId)
      VALUES ('1', 'Fix bug', 'Technical', 'High', '1', '1')
    `);

    db.run(`
      INSERT OR IGNORE INTO tasks (id, subject, status, priority, userId, projectId)
      VALUES ('2', 'Workout', 'Physical', 'Medium', '2', '2')
    `);

    db.run(`
      INSERT OR IGNORE INTO tasks (id, subject, status, priority, userId, projectId)
      VALUES ('3', 'Write API docs', 'Technical', 'Low', '1', '2')
    `);

    console.log("Seed completed");
  });
}