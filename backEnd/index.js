import dotenv from "dotenv";
import { fileURLToPath } from "node:url";

import app from "./app.js";
import connectDB from "./config/db.js";

dotenv.config();

const currentFilePath = fileURLToPath(import.meta.url);
const isDirectRun = process.argv[1] === currentFilePath;

const startServer = async () => {
  await connectDB();

  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log("ClauseIQ Backend Started Successfully");
    console.log("API Version: v1");
    console.log(`Listening on Port: ${PORT}`);
  });
};

if (isDirectRun) {
  startServer();
}

export default app;
export { startServer };
