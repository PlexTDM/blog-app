import { Schema, model, models, Model, Document, ObjectId } from "mongoose";

export interface IRefreshToken extends Document {
  tokenHash: string;
  expiresAt: Date;
  userId: ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const refreshTokenSchema = new Schema<IRefreshToken>(
  {
    tokenHash: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 },
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
    autoIndex: process.env.NODE_ENV === "development",
  }
);

const RefreshToken: Model<IRefreshToken> =
  models.RefreshToken || model("RefreshToken", refreshTokenSchema);

export default RefreshToken;
