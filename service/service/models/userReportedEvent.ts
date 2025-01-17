import mongoose, { Schema, Document, Model } from "mongoose";

// Interface for ReportedEvent model
interface IReportedEvent extends Document {
  event: mongoose.Types.ObjectId; // Reference to Event model
  user: mongoose.Types.ObjectId; // Reference to User model
  reportedAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const reportedEventSchema: Schema<IReportedEvent> = new Schema(
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
    reportedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Create and export the ReportedEvent model
const ReportedEvent: Model<IReportedEvent> = mongoose.model<IReportedEvent>("ReportedEvent", reportedEventSchema);
export default ReportedEvent;
