import mongoose from "mongoose";
import {asyncHandler} from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadCloudinary } from "../utils/cloudinary.js";
import { vedios } from "../models/vedio.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDNARY_CLOUD_NAME,
  api_key: process.env.CLOUDNARY_API_KEY,
  api_secret: process.env.CLOUDNARY_API_SECRET_KEY,
});

const PublishVedio = asyncHandler(async(req, resp) => {
  const { title, description } = req.body;

  if ([title, description].some((element) => element?.trim() === "")) {
    throw new ApiError(400, "All fields are required !");
  }

  const vedioFilePath = req.files?.vedioFile[0]?.path;
  const thumbnailFilePath = req.files?.thumbnail[0]?.path;

  if(!(vedioFilePath && thumbnailFilePath)){
    throw new ApiError(401, "file not found");
  }

  const uploadVedioToCloudnary = await uploadCloudinary(vedioFilePath);
  const uploadThumbnailToCloudnary = await uploadCloudinary(thumbnailFilePath);

  if(!uploadVedioToCloudnary){
    throw new ApiError(400, "Vedio is required!");
  }
  if(!uploadThumbnailToCloudnary){
    throw new ApiError(400, "Thumbnail is required!");
  }

  const result = await vedios.create({
    vedioFile: uploadVedioToCloudnary.url,
    thumbnail: uploadThumbnailToCloudnary.url,
    title,
    description,
    duration: uploadVedioToCloudnary.duration,
    isPublished: true
  });

  return resp
  .status(200)
  .json(
    new ApiResponse(200, result, "Vedio published successfully")
  )
});

const getVedioById = asyncHandler(async(req, resp) => {
    const { _id } = req.params;
    const result = await vedios.findById(_id);
    if(!result){
      throw new ApiError(400, "Vedio not found!");
    }
    return resp
    .status(200)
    .json(
        new ApiResponse(200, result, "vedio fetched successfully")
    )

});


const updateVedio = asyncHandler(async(req, resp) => {
  const { _id } = req.params;
  const result = await vedios.findById(_id);
  if(!result){
    throw new ApiError(400, "Vedio not found !")
  }
  console.log("result", result);
  const vedioPath = req.files;
  console.log("vedio path", vedioPath);
})


const getAllVedio = asyncHandler(async(req, resp) => {
  const result = await vedios.find();
  if(!result){
    throw new ApiError(400, "result not found");
  }

  return resp
  .status(200)
  .json(
    new ApiResponse(200, result, "Vedios fetched successfully!")
  )
})

const DeleteVedio = asyncHandler(async(req, resp) => {
  const {_id } = req.params;

  const searchVedioId = await vedios.findById(_id);

  if(!searchVedioId){
    throw new ApiError(400, "Vedio not found")
  }
  console.log("gully gully chor", searchVedioId);
  try{
     const DeletedVedio = await cloudinary.uploader.destroy(searchVedioId._id);
     console.log("Deleted Vedio", DeletedVedio);

     const Response = await vedios.deleteOne({ _id: searchVedioId._id });

     if (Response.deletedCount === 1) {
       resp.json({ message: "Item Deleted Successfully!" });
     } else {
       throw new ApiError(400, "User not found");
     }

     return resp
       .status(200)
       .json(new ApiResponse(200, "Item deleted successfully !"));

  }catch(error){
    console.log("error", error);
    throw new ApiError(500, "Internal server Error")

  }

 
})

export { PublishVedio, getVedioById, updateVedio, getAllVedio, DeleteVedio };