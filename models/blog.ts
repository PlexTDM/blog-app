import { model, models, Schema, ObjectId } from "mongoose";

export interface IBlog {
  _id: ObjectId;
  title: string;
  content: string;
  description: string;
  author: string;
  views: number;
  comments: string[];
  createdAt: Date;
  updatedAt?: Date;
}

const blogSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    views: {
      type: Number,
      required: false,
      default: 0,
    },
    comments: {
      type: [Schema.Types.ObjectId],
      ref: "Comment",
      required: false,
      default: [],
    },
    createdAt: {
      type: Date,
      required: false,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export default models.Blog || model<IBlog>("Blog", blogSchema);
