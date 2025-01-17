import mongoose, { Schema, Document, Model } from "mongoose";

// Interface for Ticket model
interface ITicket extends Document {
  event: mongoose.Types.ObjectId; // Reference to Event model
  user: mongoose.Types.ObjectId; // Reference to User model
  purchaseDate: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const ticketSchema: Schema<ITicket> = new Schema(
  {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    purchaseDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Create and export the Ticket model
const Ticket: Model<ITicket> = mongoose.model<ITicket>("Ticket", ticketSchema);
export default Ticket;
