import {playlists} from "../models/Playlists.model.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js";
import mongoose, { mongo } from "mongoose";


const createPlaylist = asyncHandler(async(req, res) => {
    const {name, description} = req.body;
    if(!(name && description)){
        throw new ApiError(401, "Information required !!!!")

    }
    const result = await playlists.create({
        name,
        description,

    });

    return res
    .status(200)
    .json(
        new ApiResponse(200, result, "Playlist created successfully!!!!")
    )
   
})

const AddVedioToPlaylist = asyncHandler(async(req, resp) => {
    const {playlistId, vedioId} = req.params;
    

    if(!mongoose.Types.ObjectId.isValid(playlistId) || !mongoose.Types.ObjectId.isValid(vedioId)){
        return resp.json({message: "Invalid vedio and playlistId"})
    }

    const results = await playlists.findByIdAndUpdate(playlistId, {
      $push: {
        videos: vedioId,
      },
     
    }, {
        new: true
    });
    console.log("results", results);

    if(!results){
        resp.json({message: "Playlist not found !!!!!"})
    }

    return resp
    .status(200)
    .json(
        new ApiResponse(200, results, "Vedio added to playlist successfully!!!!!!")
    )

})

const getUserPlaylists = asyncHandler(async(req, resp) => {
    const {userID} = req.params;
    console.log("userID ++++> :", userID);

    const result = await playlists.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(userID)

            }
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "Owner",
            }
        },
        {
            $project: {
                _id: 1,
                fullname: 1,
                avatar: 1,
                username: 1,
                Owner: {
                    $arrayElemAt: ["$Owner", 0]
                }
            }
        }, 
    ])


    console.log("somethig here", result[0]);

    
})

export { createPlaylist, AddVedioToPlaylist, getUserPlaylists };