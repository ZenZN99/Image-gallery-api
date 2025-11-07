import mongoose from "mongoose";

interface Iimage {
  title: string;
  description: string;
  imageUrl: string;
  userId: mongoose.Schema.Types.ObjectId;
  likes: number;
  likedBy: mongoose.Schema.Types.ObjectId[];
}

const imageSchema = new mongoose.Schema<Iimage>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
      maxlength: 60,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    likes: {
      type: Number,
      default: 0,
    },
    likedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],
  },
  { timestamps: true }
);

const Image = mongoose.model("Image", imageSchema);
export default Image;
