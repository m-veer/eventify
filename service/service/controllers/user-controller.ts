import mongoose, { Document } from 'mongoose';
import { Request, Response, NextFunction  } from 'express';
import { UserRequest } from '../types/express/custom';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { handleSuccess, handleError } from './response-handler';
// import dotenv from 'dotenv';
import User from '../models/user';
import Event from '../models/event';
import Ticket from '../models/ticket';
import ReportedEvent from '../models/userReportedEvent';
import rateLimit from 'express-rate-limit';
// import sanitize from 'sanitize-html';

require("dotenv").config();
const ADMIN_CREATION_PASSWORD = process.env.ADMIN_CREATION_PASSWORD;

interface SignupBody {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  location: string;
  isAdmin: boolean;
  isAdminPassword?: string;
}

interface LoginBody {
  email: string;
  password: string;
}

// interface CreateEventRequest extends Request {
//   user?: {
//     _id: mongoose.Types.ObjectId;
//   };
//   body: Partial<IEvent>;
// }

const sampleRoute = (req: Request, res: Response) => {
  res.send('Hello from the server');
};

/**
 * User signup
 */
const signup = async (req: Request<{}, {}, SignupBody>, res: Response) => {
  try {
    const { firstName, lastName, email, password, location, isAdmin, isAdminPassword } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return handleError(
        res,
        {
          message: "Email already registered",
        },
        400
      );
    }

    // If admin account is to be created, and isAdminPassword is not in request body
    if (isAdmin && !('isAdminPassword' in req.body)) {
      return handleError(
        res,
        {
          message: "Admin creation password required.",
        },
        403
      );
    }

    // Validate admin creation password
    const isPasswordValid = await bcrypt.compare(isAdminPassword ?? "", ADMIN_CREATION_PASSWORD as string);
    if (isAdmin && !isPasswordValid) {
      return handleError(res, { message: 'Invalid admin creation password.' }, 403);
    }

    // Create new user
    const user = new User({
      firstName,
      lastName,
      email,
      password,
      location,
      isAdmin
    });
    await user.save();

    // Generate token
    // const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET as string, {
    //   expiresIn: process.env.JWT_EXPIRY,
    // });

    // Remove password from response
    const userObject = user.toObject();

    // Type assertion to avoid the TypeScript error
    delete (userObject as { password?: string }).password;

    handleSuccess(
      res,
      {
        user: userObject,
        // token,
      },
      "User created successfully",
      201
    );
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
 * User login
 */
const login = async (req: Request<{}, {}, LoginBody>, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return handleError(res, { message: 'Invalid credentials' }, 401);
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET as string, {
      expiresIn: process.env.JWT_EXPIRY,
    });

    const userObject = user.toObject();

    // Type assertion to avoid the TypeScript error
    delete (userObject as { password?: string }).password;

    handleSuccess(res, { user: { ...userObject }, token });
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
 * Get current user
 */
const getUser = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;
    const user = await User.findById(userId).select('-password');
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
 * Update current user
 */
const updateUser = async (req: Request, res: Response) => {
  try {
    const updates = req.body;
    delete updates.password; // Prevent password update through this route

    const userId = req.user?._id;

    const user = await User.findByIdAndUpdate(userId, updates, {
      new: true,
      runValidators: true,
    }).select('-password');

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
 * Delete current user
 */
const deleteUser = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    if (!user) {
      return handleError(res, { message: 'User not authenticated' }, 401);
    }
    await User.findByIdAndDelete(user._id);

    handleSuccess(res, null, 'User deleted successfully');
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
 * Get specific event
 */
const getEvent = async (req: Request, res: Response) => {
  try {
    const eventId = req.headers['eventid'] as string;

    if (!eventId) {
      return handleError(res, { message: 'Event ID is required' }, 400);
    }

    const event = await Event.findById(eventId);
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

/** Get All Events Organized by Specific User */
const getEvents = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return handleError(res, { message: 'User ID is required' }, 400);
    }

    // const query: any = { userId };
    const query: any = { organizer: userId };

    const events = await Event.find(query)
      .sort({ createdAt: -1 })
      .limit(1000);

    // const events = await Event.find(query)
    // .select('-__v')
    // .sort({ date: 1, time: 1 })
    // .populate('organizer', 'name email')
    // .lean();

    handleSuccess(res, events);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return handleError(res, { message: error.message }, 500);
    }
    return handleError(res, { message: 'An unknown error occurred' }, 500);
  }
};

/**
 * Create event
 */
// Rate limiting middleware
const createEventLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5 // limit each IP to 5 event creations per windowMs
});

// Sanitization middleware
// const sanitizeEventData = (req: Request, res: Response, next: NextFunction) => {
//   if (req.body.description) {
//     req.body.description = sanitize(req.body.description, {
//       allowedTags: [
//         'p', 'b', 'i', 'em', 'strong', 'br', 'ul', 'ol', 'li'
//       ],
//       allowedAttributes: {},
//     });
//   }
//   if (req.body.description) {
//     req.body.description = sanitize(req.body.description);
//   }
//   if (req.body.parkingInfo) {
//     req.body.parkingInfo = sanitize(req.body.parkingInfo);
//   }
//   next();
// };

const createEvent = async (req: UserRequest, res: Response) => {
  try {
    const userId = req.user?._id;

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return handleError(res, new Error('Invalid user ID'), 401);
    }

    const requiredFields = [
      'name', 
      'eventTypes', 
      'description', 
      'date', 
      'time', 
      'locationType',
      'location',
      'totalTickets'
    ] as const;

    const missingFields = requiredFields.filter(field => !req.body[field]);
    if (missingFields.length > 0) {
      return handleError(
        res, 
        new Error(`Missing required fields: ${missingFields.join(', ')}`), 
        400
      );
    }

    if (req.body.locationType === 'virtual' && !req.body.location?.link) {
      return handleError(res, new Error('Virtual events require a link'), 400);
    }
    if (req.body.locationType === 'in-person' && !req.body.location) {
      return handleError(res, new Error('In-person events require an address'), 400);
    }

    const eventDate = new Date(req.body.date);
    if (eventDate < new Date()) {
      return handleError(res, new Error('Event date cannot be in the past'), 400);
    }

    const eventData = {
      ...req.body,
      organizer: userId,
      availableTickets: req.body.totalTickets,
      isReported: false,
      tags: req.body.tags?.map((tag: string) => tag.toLowerCase().trim())
    };

    const event = new Event(eventData);
    await event.save();

    const populatedEvent = await Event.findById(event._id)
      .populate('organizer', 'firstName lastName email')
      .exec();

    handleSuccess(res, populatedEvent, 'Event created successfully', 200);
  } catch (error: unknown) {
    // Type narrowing for error
    if (error instanceof Error) {
      // Now error is of type Error and has message and stack
      return handleError(res, { message: error.message }, 400);
    }
    
    // If error is not an instance of Error, you can pass a generic message
    return handleError(res, { message: 'An unknown error occurred' }, 400);
  }
};

/**
 * Filter event
 */
// const filterEvents = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const { 
//       name,
//       eventType,
//       tag,
//       startDate,
//       endDate,
//       minPrice,
//       maxPrice,
//       ageRestriction,
//       locationType
//     } = req.headers;
    
//     let query: Record<string, any> = {};

//     // Filter by name
//     if (name) {
//       query.name = name;
//     }

//     // Filter by event type
//     if (eventType) {
//       query.eventTypes = { $in: [eventType] };
//     }

//     // Filter by event tag
//     if (tag) {
//       query.eventTypes = { $in: [tag] };
//     }

//     // Filter by date range
//     if (startDate || endDate) {
//       query.date = {};
//       if (startDate) {
//         query.date.$gte = new Date(startDate as string);
//       }
//       if (endDate) {
//         query.date.$lte = new Date(endDate as string);
//       }
//     }

//     // Filter by price range
//     if (minPrice || maxPrice) {
//       query.price = {};
//       if (minPrice) {
//         query.price.$gte = Number(minPrice);
//       }
//       if (maxPrice) {
//         query.price.$lte = Number(maxPrice);
//       }
//     }

//     // Filter by age restriction
//     if (ageRestriction) {
//       query.ageRestriction = ageRestriction;
//     }

//     // Filter by location type
//     if (locationType) {
//       query.locationType = locationType;
//     }

//     const events = await Event.find(query)
//       .populate('organizer', 'firstName lastName email createdAt')
//       .sort({ date: 1 });

//     res.status(200).json({
//       success: true,
//       data: events
//     });
//   } catch (error) {
//     if (error instanceof Error) {
//       res.status(500).json({
//         success: false,
//         error: error.message
//       });
//     }
//     res.status(500).json({
//       success: false,
//       error: 'An unknown error occurred'
//     });
//   }
// };

const filterEvents = async (req: Request, res: Response): Promise<void> => {
  try {
    const { eventType, startDate, endDate, maxPrice, locationType } = req.query;
    let query: Record<string, any> = {};

    // Filter by event type
    if (eventType) {
      query.eventTypes = { $in: [eventType] };
    }

    // Filter by date range
    if (startDate || endDate) {
      query.date = {};
      if (startDate) {
        query.date.$gte = new Date(startDate as string);
      }
      if (endDate) {
        query.date.$lte = new Date(endDate as string);
      }
    }

    // Filter by price
    if (maxPrice) {
      query.price = { $lte: Number(maxPrice) };
    }

    // Filter by location type
    if (locationType) {
      query.locationType = locationType;
    }

    const events = await Event.find(query)
      .populate('organizer', 'firstName lastName email createdAt')
      .sort({ date: 1 });

    res.status(200).json({
      success: true,
      data: events
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
    res.status(500).json({
      success: false,
      error: 'An unknown error occurred'
    });
  }
};
  
/**
 * Update specific event
 */
const updateEvent = async (req: Request, res: Response) => {
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
      return handleError(
        res,
        {
          message: "Event not found or unauthorized",
        },
        404
      );
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
 * Delete event
 */
const deleteEvent = async (req: Request, res: Response) => {
  try {
    const eventId = req.headers['eventid'] as string;

    const event = await Event.findByIdAndDelete(eventId);

    if (!event) {
      return handleError(res, { message: "Event not found" }, 404);
    }

    // Delete tickets from db before deleting an event.
    handleSuccess(res, event, "Event deleted successfully");
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
 * Register for event
 */
const registerForEvent = async (req: Request, res: Response) => {
  try {
    console.log(req.body);
    console.log(req.body['eventId']);
    const eventId = req.body['eventId'];

    const userId = req.user?._id;

    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return handleError(res, { message: "Event not found" }, 404);
    }

    // Check if already registered
    const existingTicket = await Ticket.findOne({
      event: eventId,
      user: userId,
    });
    if (existingTicket) {
      return handleError(
        res,
        { message: "Already registered for this event" },
        400
      );
    }

    // Create ticket
    const ticket = new Ticket({
      event: eventId,
      user: userId,
      purchaseDate: new Date(),
    });
    await ticket.save();

    const populatedTicket = await ticket.populate([
      {
        path: "event",
        populate: { path: "organizer", select: "firstName lastName email" },
      },
      {
        path: "user",
        select: "firstName lastName email",
      },
    ]);

    handleSuccess(
      res,
      populatedTicket,
      "Successfully registered for event",
      201
    );
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
 * Unregister from event
 */
const unregisterForEvent = async (req: Request, res: Response) => {
  try {
    const eventId = req.headers['eventid'] as string;

    const userId = req.user?._id;

    const ticket = await Ticket.findOneAndDelete({
      event: eventId,
      user: userId,
    });

    if (!ticket) {
      return handleError(res, { message: "Registration not found" }, 404);
    }

    handleSuccess(res, null, "Successfully unregistered from event");
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
 * Report event
 */
const reportEvent = async (req: Request, res: Response) => {
  try {
    const eventId = req.headers['eventid'] as string;

    const userId = req.user?._id;

    // Check if user has ticket for the event
    const ticket = await Ticket.findOne({ event: eventId, user: userId });
    if (!ticket) {
      return handleError(
        res,
        { message: "Must be registered for the event to report it" },
        400
      );
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Update ticket as reported
      // ticket.isReported = true; // tickets should not be updated, hence commenting this line
      // await ticket.save({ session });

      // Update event as reported
      const event = await Event.findById(eventId);
      if (!event) {
        throw new Error("Event not found");
      }

      // event.isReported = true; // this will be done by the admin, hence commenting this line
      // await event.save({ session });

      // Create a reported event record
      const reportedEvent = new ReportedEvent({
        event: eventId,
        user: userId,
        // isReported: true, // no need of this field
      });
      await reportedEvent.save({ session });

      await session.commitTransaction();
      session.endSession();

      handleSuccess(res, null, "Event reported successfully and logged.");
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      // Type narrowing for error
      if (error instanceof Error) {
        // Now error is of type Error and has message and stack
        return handleError(res, { message: error.message }, 500);
      }
      
      // If error is not an instance of Error, you can pass a generic message
      return handleError(res, { message: 'An unknown error occurred' }, 500);
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
 * Get user tickets
 */
const getUserTickets = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;

    const tickets = await Ticket.find({ user: userId })
      .populate({
        path: "event",
        populate: {
          path: "organizer",
          select: "firstName lastName email",
        },
      })
      .sort({ purchaseDate: -1 });

    handleSuccess(res, tickets);
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
 * Delete a specific user ticket
 */
const deleteUserTicket = async (req: Request, res: Response) => {
  try {
    const eventId = req.headers['eventid'] as string;

    const userId = req.user?._id;

    // Verify and delete the specific ticket
    const result = await Ticket.findOneAndDelete({ user: userId, event: eventId });

    if (!result) {
      return handleError(res, { message: "No ticket found for the given user and event" }, 404);
    }

    handleSuccess(res, null, `Successfully deleted the ticket for event ID ${eventId}`);
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
 * Delete user tickets
 */
const deleteUserTickets = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;

    // Verify user exists
    const result = await Ticket.deleteMany({ user: userId });

    if (result.deletedCount === 0) {
      return handleError(res, { message: "No tickets found" }, 404);
    }

    handleSuccess(
      res,
      null,
      `Successfully deleted ${result.deletedCount} tickets`
    );
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

export default {
  sampleRoute,
  signup,
  login,
  getUser,
  updateUser,
  deleteUser,
  getEvent,
  getEvents,
  createEventLimiter,
  // sanitizeEventData,
  createEvent,
  filterEvents,
  updateEvent,
  deleteEvent,
  registerForEvent,
  unregisterForEvent,
  reportEvent,
  getUserTickets,
  deleteUserTicket,
  deleteUserTickets
};
