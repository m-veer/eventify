import express from 'express';
import { adminAuth } from "../middleware/auth";
import adminController from "../controllers/admin-controller";

const router = express.Router();

// Public admin routes
router.post("/login", adminController.adminLogin);

// Authenticated routes
router.use(adminAuth);

// User management
router
  .route("/users")
  .get(adminController.getAllUsers)
  .patch(adminController.updateUser)
  .delete(adminController.deleteUser);

// Event management
router
  .route("/events")
  .get(adminController.getAllEvents)
  .patch(adminController.updateEvent)
  .delete(adminController.deleteEvent);

// Reported events
router.get("/reported-events", adminController.getReportedEvents);

export default router;
