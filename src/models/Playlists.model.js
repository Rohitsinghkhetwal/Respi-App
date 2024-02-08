import mongoose from "mongoose";

const playlistSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true,
    },
    videos: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "vedios"
    }],
    owner: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    }]

}, 
{
    timestamps: true
});

export const playlists = mongoose.model("playlists", playlistSchema); 