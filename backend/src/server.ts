import { initDb } from "./infrastructure/initDb";
import { seed } from "./infrastructure/seed";
import app from "./app";

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;


app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});

initDb();
seed();