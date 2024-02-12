import {likes} from "../models/Likes.model.js"
import {vedios} from "../models/vedio.model.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import { Users } from "../models/users.model.js"
import {ApiResponse} from "../utils/ApiResponse.js"


const toggleVedioLike = asyncHandler(async(req, resp) => {
    const {vedioId} = req.params;
    
    if(!vedioId){
        throw new ApiError(400, "Vedio not found !")
    }

    const FindLikedVid = await vedios.findOne({
        vedio: vedioId,
        likedBy: req.users._id,
    })

    console.log("finding the veds", FindLikedVid);

    if(FindLikedVid){
        await FindLikedVid.remove()
        return resp
          .status(200)
          .json(new ApiResponse(200, FindLikedVid, "vedio unliked !"));
    } else{
        const result = await likes.create({
          vedio: vedioId,
          likedBy: req.users._id
        });

        return resp
        .status(200)
        .json(
            new ApiResponse(200, result, "vedio liked successfully !")
        )
    }

})

export {toggleVedioLike}