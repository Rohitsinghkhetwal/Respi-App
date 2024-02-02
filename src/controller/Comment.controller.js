import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import {comments} from "../models/Comments.model.js"

const getVediosComment = asyncHandler(async(req, res) => {
// get all the comments of the vedio 
   const {vedioId} = req.params;
   const {page = 1, limit = 10} = req.query;
})

const addComment = asyncHandler(async(req, resp) => {
    //add a comment to a vedio
})

const updateComment = asyncHandler(async(req, resp) => {
    
})

const deleteComment = asyncHandler(async(req, resp) => {

})





export { getVediosComment, addComment, updateComment, deleteComment };