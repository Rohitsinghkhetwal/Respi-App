import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from '../utils/ApiError.js';
import { Users } from "../models/users.model.js";
import {uploadCloudinary} from "../utils/cloudinary.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import  Jwt  from "jsonwebtoken";
import bcrypt from "bcrypt"
import dotenv from "dotenv";

dotenv.config({
    path: "./.env"
})




const GeneratejwtToken = (_id) => {
    const result = Jwt.sign({ _id }, process.env.ACCESS_TOKEN, {
      expiresIn: process.env.ACCESSTOKEN_EXPIRY,});
      return result;
}

const GenerateRefreshToken = (_id) => {
    const res = Jwt.sign({ _id }, process.env.REFRESH_TOKEN, {
      expiresIn: process.env.REFRSHTOKEN_EXPIRY,
    });
    return res;
}




const registerUser = asyncHandler(async(req, res) => {
    const { email, fullname, password, username} = req.body;

    if([email, fullname, password, username].some((field) => field?.trim() === "")){
          throw new ApiError(400, "All fields are required");
        }
    
    const existingUser = await Users.findOne({
        $or: [{username}, { email }]
    })

    if(existingUser){
        res.status(400).send({message: "user already exist "})
    }

    const AvatarLocalPath = req.files?.avatar[0]?.path;
    let CoverImageLocalPath;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        CoverImageLocalPath = req.files.coverImage[0].path;
    }
     

    if (!AvatarLocalPath) {
      throw new ApiError(400, "Avatar file is required");
    }

    // we have to upload avatar in cloudnary it will async operation

    const avatar = await uploadCloudinary(AvatarLocalPath);
    const CoverImage = await uploadCloudinary(CoverImageLocalPath);

    if(!avatar){
        throw new ApiError(400, "Avatar is required");
    }

    const HashedPassword = await bcrypt.hash(password, 12);

    const dbEntry = await Users.create({
        fullname,
        email,
        avatar: avatar.url,
        coverImage: CoverImage?.url || "",
        password: HashedPassword,
        username: username.toLowerCase()
    }) 

    console.log("hey this is entry on database", dbEntry);

    return res.status(201).json(
        new ApiResponse(200, dbEntry, "User registered successfully")
    )
})


const LoginUser = asyncHandler(async(req, res) => {
    const {username, email, password} = req.body;

    const NameCheck = await Users.findOne({
        $or: [{username}, {email}]
    });
    if(!NameCheck) {
        new ApiResponse(400, "User doest exist");
    }
     
    const options = {
        httpOnly: true,
        secure: true,
    }

    const ComparePassword = await bcrypt.compare(password, (NameCheck.password));
    if(ComparePassword){
        const jwtToken = GeneratejwtToken(NameCheck._id);
        const refreshToken = GenerateRefreshToken(NameCheck._id);
        
        return res
        .status(200)
        .cookie("jwtToken", jwtToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json({
          refreshToken,
          Users: {
            _id: NameCheck._id,
            name: NameCheck.username,
            email: NameCheck.email,
            fullname: NameCheck.fullname,
            avatar: NameCheck.avatar,
            CoverImage: NameCheck.coverImage
          },
          message: "Login successfully",
        });
    }else{
        new ApiResponse(400,  "Something went wrong here in loging in ===>")
    }
})

const LogoutUser = asyncHandler(async(req, res) => {
    
    await Users.findByIdAndUpdate(req.users._id, {
      $set: {
        refreshToken: undefined,
      },
    }, 
    {
        new: true
    });

    const options = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(200)
      .clearCookie("jwtToken", options)
      .clearCookie("refreshToken", options)
      .json(new ApiResponse(200, {}, "User Logged Out Successfully"))
})

const refreshJwtToken = asyncHandler(async(req, resp) => {
    const incomingRefreshToken = req.cookies.jwtToken || req.body.jwtToken;

    if(!incomingRefreshToken){
        throw new ApiError(401, "unathorized request" );
    }

    const decodedJwtToken = Jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN);

    const user = await Users.findById(decodedJwtToken?._id);
    if(!user){
        throw new ApiError(400, "Invalid refresh Token");
    }

    if(incomingRefreshToken != user?.refreshToken){
        throw new ApiError(401, "Refresh Token is used or expired");
    }

    // we have checked all the condition if they meet we wil generate the new refresh token
    const options = {
        httpOnly: true,
        secure: true,
    }
    const GenerateNewRefreshToken = GenerateRefreshToken(user._id);
    const GenerateNewJwtToken = GeneratejwtToken(user._id);

    return resp
      .status(200)
      .cookie("jwtToken", GenerateNewRefreshToken, options)
      .cookie("refreshToken", GenerateNewJwtToken, options)
      .json(
        new ApiResponse(200, {
            GenerateNewJwtToken,
            GenerateNewRefreshToken
        },
        "Access Token generated"
        )
      )



})

export { registerUser, LoginUser, LogoutUser, refreshJwtToken };