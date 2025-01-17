import express, { Request, Response, NextFunction, Application } from "express";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import path from "path";
import winston from "winston";
import routes from "./routers";

// Initialize express app
const app: Application = express();

// Create Winston logger
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "combined.log" }),
  ],
});

// Add console transport in development
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
}


mongoose
  .connect(process.env.MONGO_CONNECTION ?? "")
  .then(() => {
    logger.info("Connected to MongoDB Atlas");
  })
  .catch((error: Error) => {
    logger.error("MongoDB connection error:", error);
  });

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

// Middleware
app.use(helmet()); // Security headers
//app.use(cors()); // Enable CORS
app.use(morgan("combined")); // HTTP request logging
app.use(limiter); // Apply rate limiting
app.use(express.json({ limit: "10kb" })); // Body parser with size limit
app.use(express.urlencoded({ extended: true }));

// Serve static files from 'public' directory
app.use(express.static(path.join(__dirname, "public")));

//for payment integration
app.use(cors({
  origin:"*", 
}));


// Health check endpoint
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({
    status: "success",
    message: "Server is healthy",
    timestamp: new Date().toISOString(),
  });
});

// API routes
app.use("/api", routes);

// OpenAPI documentation
app.use("/api-docs", express.static(path.join(__dirname, "../docs/openapi")));

//Error handling middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  const error: any = new Error("Not Found");
  error.status = 404;
  next(error);
});

app.use((error: any, req: Request, res: Response, next: NextFunction): void => {
  logger.error(error.stack);

  // Handle validation errors
  if (error.name === "ValidationError") {
    res.status(400).json({
      status: "error",
      code: "VALIDATION_ERROR",
      message: error.message,
      errors: Object.values(error.errors).map((err: any) => ({
        field: err.path,
        message: err.message,
      })),
    });
    return;
  }

  // Handle duplicate key errors
  if (error.code === 11000) {
    res.status(400).json({
      status: "error",
      code: "DUPLICATE_KEY_ERROR",
      message: "Duplicate field value entered",
      field: Object.keys(error.keyValue)[0],
    });
    return;
  }

  // Handle JWT errors
  if (error.name === "JsonWebTokenError") {
    res.status(401).json({
      status: "error",
      code: "INVALID_TOKEN",
      message: "Invalid token. Please log in again!",
    });
    return;
  }

  // Handle expired JWT
  if (error.name === "TokenExpiredError") {
    res.status(401).json({
      status: "error",
      code: "TOKEN_EXPIRED",
      message: "Your token has expired! Please log in again.",
    });
    return;
  }

  // Default error
  res.status(error.status || 500).json({
    status: "error",
    code: error.code || "INTERNAL_SERVER_ERROR",
    message: error.message || "An unexpected error occurred!",
    ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
  });
});

// Unhandled rejection handler
process.on("unhandledRejection", (error: any) => {
  logger.error("UNHANDLED REJECTION! 💥 Shutting down...");
  logger.error(error);
  // Gracefully shutdown
  process.exit(1);
});

// SIGTERM handler
process.on("SIGTERM", () => {
  logger.info("👋 SIGTERM RECEIVED. Shutting down gracefully");
  process.exit(1);
});

export default app;
