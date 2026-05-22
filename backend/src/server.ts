import { seed } from "./infrastructure/seed";
import app from "./app";
import { runMigrations } from "./infrastructure/migrations/migration";

runMigrations();
const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;


setTimeout(() => {
  console.log("Seeding database...");
  seed();

  app.listen(PORT, () => {
    console.log(`API listening on http://localhost:${PORT}`);
  });
}, 500);