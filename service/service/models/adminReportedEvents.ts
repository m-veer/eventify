import mongoose, { Schema, Document } from 'mongoose';

interface IReportedEvent extends Document {
  event: mongoose.Types.ObjectId;
  reportedAt: Date;
}

const reportedEventSchema = new Schema({
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  reportedAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model<IReportedEvent>('ReportedEvent', reportedEventSchema);    