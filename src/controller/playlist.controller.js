import {playlists} from "../models/Playlists.model.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js";
import mongoose from "mongoose";


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

const getplayListById = asyncHandler(async(req, resp) => {
    const { Id} = req.params;
    if(!Id){
        throw new ApiError(400, "Id does not exist!");
    }

    const result = await playlists.findById(Id);
    return resp
    .status(200)
    .json(
        new ApiResponse(200, result, "playList Fetched successfully !!!!")
    )
})

const removeVediotoPlaylist = asyncHandler(async(req, resp) => {
    const {playlistId, vedioId} = req.params;

    if(!mongoose.Types.ObjectId.isValid(playlistId) || !mongoose.Types.ObjectId.isValid(vedioId)){
        throw new ApiError(401, "Vedios not found !")

    }

    const searchingId = await playlists.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(playlistId),
        },
      },
      {
        $match: {
          videos: {
            $elemMatch: {
              $eq: new mongoose.Types.ObjectId(vedioId),
            },
          },
        },
      },
    ]);
   
    const ID = searchingId[0];
    const vidID = vedioId.toString();

    const operation = ID.videos.map(item => item.toString());
    const index = operation.indexOf(vidID);
    

    if(index !== -1){
        operation.splice(index, 1)
    }

   const result = await playlists.findByIdAndUpdate(playlistId, {
    $set: {
        videos: operation
    }

   },
   {
    new: true
   })
    console.log("vedios are in the arrays", result);

    return resp
    .status(200)
    .json(
        new ApiResponse(200, result, "Vedio deleted successfully !!!")
    )
})

const deletePlaylist = asyncHandler(async(req, resp) => {
    const {playListId} = req.params;

    if(!playListId){
        throw new ApiError(400, "playlist not found !!!")
    }

    const result = await playlists.findByIdAndDelete(playListId);

    if(result.deletedCount === 1){
        resp.json({message: "Playlist deleted successful  !"})
    }else{
        resp.json({message: "palylist not found !"})
    }

    return resp
    .status(200)
    .json(
        new ApiResponse(200, "Done successfully")
    )

})

const updatePlaylist = asyncHandler(async(req, resp) => {
    const {playListId} = req.params;
    const {name, description} = req.body;

    if(!(name || description)){
        throw new ApiError(400, "Field required !")
    }

    if(!playListId){
        resp.json({message: "Please provide valid information"})
    }

    const response = await playlists.findByIdAndUpdate(playListId, {
        $set: {
            name,
            description
        }

    },
    {
        new: true
    })

    return resp
    .status(200)
    .json(
        new ApiResponse(200, response, "Playlist Updated Successfully...")
    )


})

export {
  createPlaylist,
  AddVedioToPlaylist,
  getUserPlaylists,
  getplayListById,
  removeVediotoPlaylist,
  deletePlaylist,
  updatePlaylist,
};