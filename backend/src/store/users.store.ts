import { db } from "../infrastructure/db";

export interface User {
    id: string;
    name: string;
}

export const getAll = (): Promise<User[]> => {
    return new Promise((resolve, reject) => {
        db.all("SELECT * FROM users", (err, rows) => {
            if (err) reject(err);
            else resolve(rows as User[]);
        });
    });
};

export const getById = (id: string): Promise<User | undefined> => {
    return new Promise((resolve, reject) => {
        db.get(`SELECT * FROM users WHERE id='${id}'`, (err, row) => {
            if (err) reject(err);
            else resolve(row as User);
        });
    });
};

export const add = (name: string): Promise<User> => {
    const id = Date.now().toString();

    return new Promise((resolve, reject) => {
        db.run(
            `INSERT INTO users (id, name) VALUES ('${id}', '${name}')`,
            (err) => {
                if (err) reject(err);
                else resolve({ id, name });
            }
        );
    });
};
export const getClientStats = (): Promise<any[]> => {
    return new Promise((resolve, reject) => {
        db.all(
            `
            SELECT u.name as client, COUNT(t.id) as count
            FROM users u
            LEFT JOIN tasks t ON t.userId = u.id
            GROUP BY u.id
            `,
            (err, rows) => {
                if (err) return reject(err);
                resolve(rows as any[]);
            }
        );
    });
};
export const remove = (id: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        db.run(`DELETE FROM users WHERE id='${id}'`, (err) => {
            if (err) reject(err);
            else resolve();
        });
    });
};
