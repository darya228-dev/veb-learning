import { db } from "../infrastructure/db";
import { Task, CreateTaskDto, UpdateTaskDto } from "../domain/task.dto";

export const getAll = (): Promise<Task[]> => {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM tasks", (err, rows) => {
      if (err) reject(err);
      else resolve(rows as Task[]);
    });
  });
};

export const getById = (id: string): Promise<Task | undefined> => {
  return new Promise((resolve, reject) => {
    db.get(`SELECT * FROM tasks WHERE id = ?`, [id], (err, row) => {
      if (err) reject(err);
      else resolve(row as Task);
    });
  });
};

export const add = (task: CreateTaskDto): Promise<Task> => {
  const id = Date.now().toString();

  return new Promise((resolve, reject) => {
    db.run(
      `
      INSERT INTO tasks (id, subject, status, priority, message, author)
      VALUES (?, ?, ?, ?, ?, ?)
    `,
      [
        id,
        task.subject,
        task.status,
        task.priority ?? null,
        task.message ?? null,
        task.author ?? null,
      ],
      (err) => {
        if (err) reject(err);
        else resolve({ ...task, id });
      }
    );
  });
};

export const remove = (id: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.run(`DELETE FROM tasks WHERE id = ?`, [id], (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
};

export const update = (id: string, data: UpdateTaskDto): Promise<Task | null> => {
  return new Promise((resolve, reject) => {
    db.run(
      `
      UPDATE tasks 
      SET subject = ?, 
          status = ?, 
          priority = ?, 
          message = ?, 
          author = ?
      WHERE id = ?
      `,
      [
        data.subject,
        data.status,
        data.priority ?? null,
        data.message ?? null,
        data.author ?? null,
        id
      ],
      function (err) {
        if (err) return reject(err);

        if (this.changes === 0) return resolve(null);

        db.get(`SELECT * FROM tasks WHERE id = ?`, [id], (err, row) => {
          if (err) return reject(err);
          resolve(row as Task);
        });
      }
    );
  });
};


export const getPaginated = (
  page: number,
  limit: number,
  status?: string
): Promise<{ items: Task[]; total: number }> => {
  return new Promise((resolve, reject) => {
    const offset = (page - 1) * limit;

    let where = "";
    let params: any[] = [];

    if (status) {
      where = "WHERE status = ?";
      params.push(status);
    }

    db.all(
      `
      SELECT * FROM tasks
      ${where}
      LIMIT ?
      OFFSET ?
      `,
      [...params, limit, offset],
      (err, rows) => {
        if (err) return reject(err);

        db.get(
          `
          SELECT COUNT(*) as total
          FROM tasks
          ${where}
          `,
          params,
          (err2, countRow: any) => {
            if (err2) return reject(err2);

            resolve({
              items: rows as Task[],
              total: countRow.total
            });
          }
        );
      }
    );
  });
};



export const getFiltered = (status: string, limit: number): Promise<Task[]> => {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT * FROM tasks 
       WHERE status = ? 
       ORDER BY subject 
       LIMIT ?`,
      [status, limit],
      (err, rows) => {
        if (err) reject(err);
        else resolve(rows as Task[]);
      }
    );
  });

};