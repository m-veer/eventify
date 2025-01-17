import dotenv from "dotenv";
import mongoose from "mongoose";
import app from "./service/app";
import logger from "./service/utils/logger";

dotenv.config();

const PORT: number = parseInt(process.env.PORT ?? "9000", 10);

// Start server
const server = app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_CONNECTION as string, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
  })
  .then(() => {
    logger.info("Connected to MongoDB Atlas");
  })
  .catch((error: Error) => {
    logger.error("MongoDB connection error:", error);
    process.exit(1);
  });

// Handle uncaught exceptions
process.on("uncaughtException", (err: Error) => {
  logger.error("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  logger.error(err.name, err.message);
  logger.error(err.stack ?? "No stack trace available");
  process.exit(1);
});

// Handle unhandled rejections
process.on("unhandledRejection", (err: any) => {
  logger.error("UNHANDLED REJECTION! 💥 Shutting down...");
  logger.error(err.name, err.message);
  logger.error(err.stack ?? "No stack trace available");
  server.close(() => {
    process.exit(1);
  });
});

// Handle SIGTERM
process.on("SIGTERM", () => {
  logger.info("👋 SIGTERM RECEIVED. Shutting down gracefully");
  server.close(() => {
    mongoose.connection.close().then(() => {
      logger.info("💥 Process terminated!");
      process.exit(0);
    });
  });
});

module.exports = server;
