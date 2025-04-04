import { Schema, model, models, ObjectId } from "mongoose";

export interface IComment extends Document {
  _id: ObjectId;
  author: ObjectId;
  blogId: ObjectId;
  content: string;
  edited: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const commentSchema = new Schema<IComment>(
  {
    content: {
      type: String,
      required: true,
    },
    blogId: {
      type: Schema.Types.ObjectId,
      ref: "Blog",
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    edited: {
      type: Boolean,
      required: false,
      default: false,
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

export default models.Comment || model<IComment>("Comment", commentSchema);
