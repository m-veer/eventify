import mongoose from "mongoose";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user";
import Event from "../models/event";
import Ticket from "../models/ticket";
import ReportedEvent from "../models/userReportedEvent";
import { handleSuccess, handleError } from "./response-handler";

/**
 * Admin login
 */
const adminLogin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const admin = await User.findOne({ email, isAdmin: true });
    if (!admin || !(await admin.comparePassword(password))) {
      return handleError(
        res,
        {
          message: "Invalid admin credentials",
        },
        401
      );
    }

    const token = jwt.sign(
      { userId: admin._id, isAdmin: true },
      process.env.JWT_SECRET as string,
      { expiresIn: process.env.JWT_EXPIRY }
    );

    const adminObject = admin.toObject();

    // Type assertion to avoid the TypeScript error
    delete (adminObject as { password?: string }).password;

    handleSuccess(res, {
      user: {
        ...adminObject
      },
      token,
    });
  } catch (error: unknown) {
    // Type narrowing for error
    if (error instanceof Error) {
      // Now error is of type Error and has message and stack
      return handleError(res, { message: error.message }, 500);
    }
    
    // If error is not an instance of Error, you can pass a generic message
    return handleError(res, { message: 'An unknown error occurred' }, 500);
  }
};

/**
 * Get all users
 */
const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.find({ isAdmin: false })
      .select("-password")
      .sort({ createdAt: -1 });

    handleSuccess(res, { users });
  } catch (error: unknown) {
    // Type narrowing for error
    if (error instanceof Error) {
      // Now error is of type Error and has message and stack
      return handleError(res, { message: error.message }, 500);
    }
    
    // If error is not an instance of Error, you can pass a generic message
    return handleError(res, { message: 'An unknown error occurred' }, 500);
  }
};

/**
 * Update user (admin)
 */
const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.headers['userid'] as string;
    const updates = req.body;

    // Prevent updating sensitive fields
    delete updates.password;
    delete updates.isAdmin;

    const user = await User.findByIdAndUpdate(userId, updates, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!user) {
      return handleError(res, { message: "User not found" }, 404);
    }

    handleSuccess(res, user);
  } catch (error: unknown) {
    // Type narrowing for error
    if (error instanceof Error) {
      // Now error is of type Error and has message and stack
      return handleError(res, { message: error.message }, 500);
    }
    
    // If error is not an instance of Error, you can pass a generic message
    return handleError(res, { message: 'An unknown error occurred' }, 500);
  }
};

/**
 * Delete user (admin)
 */
const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.headers['userid'] as string;

    // Start a session for transaction
    const session = await User.startSession();
    session.startTransaction();

    try {
      // Delete user's tickets
      await Ticket.deleteMany({ user: userId }, { session });

      // Delete user's events
      await Event.deleteMany({ organizer: userId }, { session });

      // Delete user
      const user = await User.findByIdAndDelete(userId).session(session);

      if (!user) {
        await session.abortTransaction();
        return handleError(res, { message: "User not found" }, 404);
      }

      await session.commitTransaction();
      handleSuccess(res, null, "User and associated data deleted successfully");
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  } catch (error: unknown) {
    // Type narrowing for error
    if (error instanceof Error) {
      // Now error is of type Error and has message and stack
      return handleError(res, { message: error.message }, 500);
    }
    
    // If error is not an instance of Error, you can pass a generic message
    return handleError(res, { message: 'An unknown error occurred' }, 500);
  }
};

/**
 * Get all events (admin)
 */
const getAllEvents = async (req: Request, res: Response): Promise<void> => {
  try {
    const events = await Event.find()
      .populate("organizer", "firstName lastName email")
      .sort({ date: 1 });

    handleSuccess(res, { events });
  } catch (error: unknown) {
    // Type narrowing for error
    if (error instanceof Error) {
      // Now error is of type Error and has message and stack
      return handleError(res, { message: error.message }, 500);
    }
    
    // If error is not an instance of Error, you can pass a generic message
    return handleError(res, { message: 'An unknown error occurred' }, 500);
  }
};

/**
 * Update event (admin)
 */
const updateEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const eventId = req.headers['eventid'] as string;

    // Validate eventId
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return handleError(res, { message: "Invalid eventId format" }, 400);
    }

    const event = await Event.findByIdAndUpdate(eventId, req.body, {
      new: true,
      runValidators: true,
    }) // .populate("organizer", "firstName lastName email");

    if (!event) {
      return handleError(res, { message: "Event not found" }, 404);
    }

    handleSuccess(res, event);
  } catch (error: unknown) {
    // Type narrowing for error
    if (error instanceof Error) {
      // Now error is of type Error and has message and stack
      return handleError(res, { message: error.message }, 500);
    }
    
    // If error is not an instance of Error, you can pass a generic message
    return handleError(res, { message: 'An unknown error occurred' }, 500);
  }
};

/**
 * Delete event (admin)
 */
const deleteEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const eventId = req.headers['eventid'] as string;

    // Validate eventId
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return handleError(res, { message: "Invalid eventId format" }, 400);
    }

    const session = await Event.startSession();
    session.startTransaction();

    try {
      // Delete event tickets
      
      await Ticket.deleteMany({ event: eventId }, { session });

      // Delete event
      const event = await Event.findByIdAndDelete(eventId).session(session);

      if (!event) {
        await session.abortTransaction();
        return handleError(res, { message: "Event not found" }, 404);
      }

      await session.commitTransaction();
      handleSuccess(
        res,
        null,
        "Event and associated tickets deleted successfully"
      );
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  } catch (error: unknown) {
    // Type narrowing for error
    if (error instanceof Error) {
      // Now error is of type Error and has message and stack
      return handleError(res, { message: error.message }, 500);
    }
    
    // If error is not an instance of Error, you can pass a generic message
    return handleError(res, { message: 'An unknown error occurred' }, 500);
  }
};

/**
 * Get reported events
 */
export const getReportedEvents = async (req: Request, res: Response): Promise<void> => {
  try {
    const reportedEvents = await Event.find({ isReported: true })
      .select('_id name description date time locationType')
      .lean();

    res.status(200).json({
      success: true,
      data: reportedEvents
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'An unknown error occurred'
      });
    }
  }
};

export default {
  adminLogin,
  getAllUsers,
  updateUser,
  deleteUser,
  getAllEvents,
  updateEvent,
  deleteEvent,
  getReportedEvents,
};
