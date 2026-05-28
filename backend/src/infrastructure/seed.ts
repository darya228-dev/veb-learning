import { db } from "./db";

export function seed() {
  console.log("Seeding database...");

  db.serialize(() => {
    console.log("Seeding users...");

    db.run(`INSERT OR IGNORE INTO users (id, name, role) VALUES ('1', 'Admin', 'admin')`);
    db.run(`INSERT OR IGNORE INTO users (id, name, role) VALUES ('2', 'John', 'user')`);
    db.run(`INSERT OR IGNORE INTO users (id, name, role) VALUES ('3', 'Anna', 'user')`);
    db.run(`INSERT OR IGNORE INTO users (id, name, role) VALUES ('4', 'Maria', 'user')`);
    db.run(`INSERT OR IGNORE INTO users (id, name, role) VALUES ('5', 'Oleh', 'user')`);

    console.log("Seeding projects...");

    db.run(`INSERT OR IGNORE INTO projects (id, name) VALUES ('1', 'Test Project')`);
    db.run(`INSERT OR IGNORE INTO projects (id, name) VALUES ('2', 'Backend App')`);
    db.run(`INSERT OR IGNORE INTO projects (id, name) VALUES ('3', 'Frontend App')`);
    db.run(`INSERT OR IGNORE INTO projects (id, name) VALUES ('4', 'Support System')`);

    console.log("Seeding tasks...");

    db.run(`
      INSERT OR IGNORE INTO tasks (id, subject, status, priority, author, userId, projectId)
      VALUES ('1', 'Fix bug', 'Technical', 'High', 'Admin', '1', '1')
    `);

    db.run(`
      INSERT OR IGNORE INTO tasks (id, subject, status, priority, author, userId, projectId)
      VALUES ('2', 'Workout', 'Physical', 'Medium', 'John', '2', '2')
    `);

    db.run(`
      INSERT OR IGNORE INTO tasks (id, subject, status, priority, author, userId, projectId)
      VALUES ('3', 'Write API docs', 'Technical', 'Low', 'Admin', '1', '2')
    `);

    db.run(`
      INSERT OR IGNORE INTO tasks (id, subject, status, priority, author, userId, projectId)
      VALUES ('4', 'Laptop does not turn on', 'Technical', 'High', 'Anna', '3', '4')
    `);

    db.run(`
      INSERT OR IGNORE INTO tasks (id, subject, status, priority, author, userId, projectId)
      VALUES ('5', 'Printer problem', 'Technical', 'Medium', 'Anna', '3', '4')
    `);

    db.run(`
      INSERT OR IGNORE INTO tasks (id, subject, status, priority, author, userId, projectId)
      VALUES ('6', 'Broken chair', 'Physical', 'Low', 'Maria', '4', '1')
    `);

    db.run(`
      INSERT OR IGNORE INTO tasks (id, subject, status, priority, author, userId, projectId)
      VALUES ('7', 'Projector cable missing', 'Physical', 'Medium', 'Maria', '4', '3')
    `);

    db.run(`
      INSERT OR IGNORE INTO tasks (id, subject, status, priority, author, userId, projectId)
      VALUES ('8', 'Cannot login to system', 'Technical', 'High', 'Oleh', '5', '2')
    `);

    console.log("Seed completed");
  });
}