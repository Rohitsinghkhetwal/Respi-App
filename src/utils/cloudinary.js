import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv"
import fs from 'fs';    
dotenv.config({
  path: "./.env",
}); 

cloudinary.config({
  cloud_name: process.env.CLOUDNARY_CLOUD_NAME,
  api_key: process.env.CLOUDNARY_API_KEY,
  api_secret: process.env.CLOUDNARY_API_SECRET_KEY,
});



const uploadCloudinary = async (localFilePath) => {
    try{
        if(!localFilePath) return '404 not found !!!!!';
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type:'auto'
        });
        fs.unlinkSync(localFilePath);
        return response;
    }catch(err){
        fs.unlinkSync(localFilePath);
        return null;
    }

}

export {uploadCloudinary}
