import mongoose from "mongoose";

const LikesSchema = new mongoose.Schema({
  commment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "comments",
  },
  vedio: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "vedios",
  },
  likedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users"
  },
  tweet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "tweets"
  }
},
{
    timestamps: true,
});

export const likes = mongoose.model("likes", LikesSchema); 