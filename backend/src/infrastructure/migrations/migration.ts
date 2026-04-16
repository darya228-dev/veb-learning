import fs from "fs";
import path from "path";
import { db } from "../db";

const migrations = [
    "001_init.sql",
    "002_indexes.sql",
];

export function runMigrations() {
    console.log("Running migrations...");

    db.serialize(() => {
        db.run(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        id TEXT PRIMARY KEY
      )
    `);

        migrations.forEach((file) => {
            const existsQuery = `SELECT id FROM schema_migrations WHERE id = ?`;

            db.get(existsQuery, [file], (err, row) => {
                if (row) return;

                const sql = fs.readFileSync(
                    path.join(__dirname, file),
                    "utf-8"
                );

                db.exec(sql, (err) => {
                    if (err) console.error(err);
                    else {
                        db.run(`INSERT INTO schema_migrations (id) VALUES (?)`, [file]);
                        console.log(`Applied migration: ${file}`);
                    }
                });
            });
        });
    });
}