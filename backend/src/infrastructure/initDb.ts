import fs from "fs";
import path from "path";
import { db } from "./db";

export function initDb() {
    const schema = fs.readFileSync(
        path.resolve(__dirname, "schema.sql"),
        "utf-8"
    );

    db.exec(schema, (err) => {
        if (err) console.error("Schema error:", err);
        else console.log("DB initialized");
    });
}