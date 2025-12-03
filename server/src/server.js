// server/src/server.js
import connectDB from "./config/db.js";
import app from "./app.js";

const PORT = process.env.PORT || 5000;

(async () => {
  // Attempt DB connection (function returns early if MONGODB_URI not set)
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
})();
