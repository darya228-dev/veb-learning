import { db } from "../infrastructure/db";

export interface Project {
    id: string;
    name: string;
}

export const getAll = (): Promise<Project[]> => {
    return new Promise((resolve, reject) => {
        db.all("SELECT * FROM projects", (err, rows) => {
            if (err) reject(err);
            else resolve(rows as Project[]);
        });
    });
};

export const add = (name: string): Promise<Project> => {
    const id = Date.now().toString();

    return new Promise((resolve, reject) => {
        db.run(
            `INSERT INTO projects (id, name) VALUES ('${id}', '${name}')`,
            (err) => {
                if (err) reject(err);
                else resolve({ id, name });
            }
        );
    });
};