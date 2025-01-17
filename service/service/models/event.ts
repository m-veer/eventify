import mongoose, { Schema, Document, Model } from "mongoose";

// interface FAQ {
//   question: string;
//   answer: string;
// }

interface IEvent extends Document {
  name: string;
  eventTypes: string[];
  description: string;
  date: Date;
  time: string;
  locationType: 'virtual' | 'in-person';
  // location: {
  //   address?: string;
  //   link?: string;
  //   coordinates?: {
  //     latitude: number;
  //     longitude: number;
  //   };
  // };
  location: string;
  organizer: mongoose.Types.ObjectId;
  isReported: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  reportedAt?: Date;
  price: number;
  totalTickets: number;
  availableTickets: number;
  tags: string[];
  imageUrl: string;
  ageRestriction: string;
  doorTime: string;
  parkingInfo: string;
  // faqs: Record<number, FAQ>;
  eventPhotoURL: string;
}

const eventSchema: Schema<IEvent> = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    eventTypes: {
      type: [String],
      required: true,
      validate: {
        validator: (array: string[]) => array.length > 0,
        message: 'At least one event type is required',
      },
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    locationType: {
      type: String,
      required: true,
      enum: ['virtual', 'in-person'],
    },
    // location: {
    //   address: {
    //     type: String,
    //   },
    //   link: {
    //     type: String,
    //   },
    //   coordinates: {
    //     latitude: {
    //       type: Number,
    //     },
    //     longitude: {
    //       type: Number,
    //     },
    //   },
    // },
    location: {
      type: String,
      required: true
    },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isReported: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
    },
    updatedAt: {
      type: Date,
    },
    reportedAt: {
      type: Date,
    },
    price: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalTickets: {
      type: Number,
      required: true,
      min: 0,
    },
    availableTickets: {
      type: Number,
      required: true,
      min: 0,
    },
    tags: {
      type: [String],
      default: [],
    },
    imageUrl: {
      type: String,
      // required: true,
    },
    ageRestriction: {
      type: String,
      required: true,
    },
    doorTime: {
      type: String,
      required: true,
    },
    parkingInfo: {
      type: String,
    },
    // faqs: {
    //   type: Map,
    //   of: {
    //     question: String,
    //     answer: String,
    //   },
    //   default: {},
    // },
    eventPhotoURL: {
      type: String,
      default: ""
    }
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);


const Event: Model<IEvent> = mongoose.model<IEvent>("Event", eventSchema);
// export { FAQ };
export default Event;