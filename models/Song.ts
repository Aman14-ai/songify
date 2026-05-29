import mongoose, { Schema, models, model } from "mongoose";

const SongSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    folderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Folder",
      required: true,
    },

    audioUrl: {
      type: String,
      required: true,
    },

    cloudinaryPublicId: {
      type: String,
      required: true,
    },

    duration: {
      type: Number,
      default: 0,
    },

    playCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Song = models.Song || model("Song", SongSchema);

export default Song;