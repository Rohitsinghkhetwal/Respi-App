import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import {comments} from "../models/Comments.model.js"
import {ApiError} from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import {Users} from "../models/users.model.js";
import {vedios} from "../models/vedio.model.js";

const getVediosComment = asyncHandler(async(req, res) => {
// get all the comments of the vedio 
   const {vedioId} = req.params;
   const {page = 1, limit = 10} = req.query;
})

const updateComment = asyncHandler(async(req, resp) => {
    const {updatedComment} = req.body;
    const {commentId} = req.params;

    if(!updatedComment){
        resp.ApiError(400, "All fields are required !")
    }

    if(!mongoose.Types.ObjectId.isValid(commentId)){
        throw new ApiError(401, "Vedio not found !")
    }

    const result = await comments.findByIdAndUpdate(commentId,{
        $set: {
            content: updateComment
        }

    },
    {
        new: true
    })

    return resp
    .status(200)
    .json(
        new ApiResponse(200, result, "comment updated successfully !")
    )
})

const deleteComment = asyncHandler(async(req, resp) => {
    const {commentId} = req.params;

    if(!commentId){
        throw new ApiError(400, "Something went wrong !")
    }

    const result = await comments.findByIdAndRemove(commentId);
    return resp
    .status(200)
    .json(new ApiResponse(200, "Comment deleted successfully!"))

})

const addComment = asyncHandler(async (req, resp) => {
  const { comment } = req.body;
  const { vedioId} = req.params;
  
  if(!comment ||  !vedioId){
    throw new ApiError(400, "All fields are required !")
  }

  const SearchVedio = await vedios.findById(vedioId);

  if(!SearchVedio){
    resp.json({message: "Vedio not found !"})
  }

  const postComment = await comments.create({
    content: comment,
    vedio: vedioId,
    owner: req.users._id,
  });
  console.log("post here the comments");

  return resp
  .status(200)
  .json(
    new ApiResponse(200, postComment, "Comment added Successfully !!!")
  ) 
});

export { getVediosComment, addComment, updateComment, deleteComment };