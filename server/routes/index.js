import express from "express";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url"; // ✅ Add this
import { readdir } from "fs/promises";
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const loadRoutesFrom = async (folder, middleware = null) => {
  const dirPath = path.join(__dirname, folder);
  const files = await readdir(dirPath);

  for (const file of files) {
    if (!file.endsWith(".js")) continue;

    const filePath = path.join(dirPath, file);
    const routeModule = await import(pathToFileURL(filePath).href); // ✅ Fix here
    const route = routeModule.default;

    const basePath = "/" + file
      .replace(".routes", "")
      .replace("Routes", "")
      .replace(".js", "")
      .toLowerCase();

    if (middleware) {
      router.use(basePath, middleware, route);
    } else {
      router.use(basePath, route);
    }
  }
};

await loadRoutesFrom("public");
await loadRoutesFrom("protected", authMiddleware);

export default router;
