import mongoose from "mongoose";

const TweetSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    }, 
    content: {
        type: String,
        required: true,
    }
    
}, {
    timestamps: true
}
);

export const tweets = mongoose.model("tweets", TweetSchema);