import mongoose, { Schema, models, model } from "mongoose";

const FolderSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    cloudinaryFolderPath: {
      type: String,
      required: true,
    },

    isPublic: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Folder = models.Folder || model("Folder", FolderSchema);

export default Folder;