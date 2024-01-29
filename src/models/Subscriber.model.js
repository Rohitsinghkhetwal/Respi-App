import mongoose from "mongoose";

const SubscriberSchema  = new mongoose.Schema({
    subscriber: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users"
    },
    channel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users"
    }


})

export const Subscriptions = mongoose.model("Subscriptions", SubscriberSchema);