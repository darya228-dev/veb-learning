import sqlite3 from "sqlite3";
import path from "path";

const dbPath = path.resolve(__dirname, "../../data/app.db");

export const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error("DB error:", err);
    } else {
        console.log("SQLite connected");
    }
});


db.run("PRAGMA foreign_keys = ON");