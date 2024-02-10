import mongoose from "mongoose";
import {tweets} from "../models/Tweets.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {asyncHandler} from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js";


const createTweet = asyncHandler(async(req, resp) => {
    const {message} = req.body;

    if(!req.users._id) {
        resp.json({message: "user not logged in !"})
    }

    if(!message){
        resp.json({message: "All fields are required"})
    }

    const result = await tweets.create({
        content: message,
        owner: req.users._id

    })
    
    return resp
    .status(200)
    .json(
        new ApiResponse(200, result, "Tweets created successfully !")
    )
})

const getUsersTweet = asyncHandler(async(req, resp) => {

     if (!req.users._id) {
       resp.json({ message: "Please logged in first!" });
     }

     const UserTweets = await tweets.aggregate([
       {
         $match: {
           owner: new mongoose.Types.ObjectId(req.users._id),
         },
       },
       {
        $project: {
            content: 1,
            _id: 0
        }
       }
     ]);

     return resp
     .status(200)
     .json(
        new ApiResponse(200, UserTweets, "User tweets Fetched successfully !")
     )
})

const updateTweet = asyncHandler(async(req, resp) => {
    const {updatedMessage} = req.body;
    const {tweetId} = req.params;

    if(!updatedMessage){
        resp.json({message: "message is required !"})
    }

    const Message = await tweets.findByIdAndUpdate(tweetId, {
      $set: {
        content: updatedMessage,
      },
    },
    {
        new: true
    });

    return resp
    .status(200)
    .json(
        new ApiResponse(200, Message, "Tweet updated Successfully!")
    )
})

const DeleteTweets = asyncHandler(async(req, resp) => {
    const {tweetId} = req.params;
    if(!tweetId){
        resp.json({message: "Please provide tweet to delete"})
    }

    const result = await tweets.findByIdAndDelete(tweetId);
    console.log("deleted count" , result);
   
    return resp
    .status(200)
    .json(
        new ApiResponse(200, "Tweet deleted Successfully !")
    )
})

export { createTweet, getUsersTweet, updateTweet, DeleteTweets };