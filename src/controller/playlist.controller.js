import {playlists} from "../models/Playlists.model.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js"
import mongoose from "mongoose";


const createPlaylist = asyncHandler(async(req, res) => {
    const {name, description} = req.body;
    const userId =  new mongoose.Types.ObjectId(req.users._id)
    console.log("userId", userId);

    // code body begins 

   
    
   
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

export { createPlaylist, AddVedioToPlaylist };