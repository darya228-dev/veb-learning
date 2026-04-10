import { db } from "./db";

export function seed() {
    console.log("Seeding database...");

    db.run(`INSERT INTO users (id, name) VALUES ('1', 'Admin')`);
    db.run(`INSERT INTO users (id, name) VALUES ('2', 'John')`);

    db.run(`INSERT INTO projects (id, name) VALUES ('1', 'Test Project')`);
    db.run(`INSERT INTO projects (id, name) VALUES ('2', 'Backend App')`);

    db.run(`
    INSERT INTO tasks (id, subject, status, priority, userId, projectId)
    VALUES ('1', 'Fix bug', 'Technical', 'High', '1', '1')
  `);

    db.run(`
    INSERT INTO tasks (id, subject, status, priority, userId, projectId)
    VALUES ('2', 'Workout', 'Physical', 'Medium', '2', '2')
  `);

    console.log("Seed completed");
}