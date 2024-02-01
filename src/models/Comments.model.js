import mongoose from "mongoose";

const commentsSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
    }, 
    vedio: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "vedios"
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    }

},{
    timestamps: true
});

export const comments = mongoose.model("comments", commentsSchema);