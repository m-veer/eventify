import express from 'express';
import { auth } from "../middleware/auth";
import userController from "../controllers/user-controller";

const router = express.Router();

// Public routes
router.post("/signup", userController.signup);
router.post("/login", userController.login);

router.get('/events/filter', userController.filterEvents);

// Authenticated routes
router.use(auth);

// User profile management
router
  .route("/")
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

// User events management
router
  .route("/events")
  .post(
    userController.createEvent)
  .patch(userController.updateEvent)
  .delete(userController.deleteEvent);

// Event registration
router.post("/events/register", userController.registerForEvent);
router.delete("/events/unregister", userController.unregisterForEvent);
router.post("/events/report", userController.reportEvent);


// Actions on Events
router.get("/event", userController.getEvent);
router.get("/events", userController.getEvents);

// Ticket management
router
  .route("/events/tickets")
  .get(userController.getUserTickets)
  .delete(userController.deleteUserTickets);

router.delete("/events/ticket", userController.deleteUserTicket);

export default router;
