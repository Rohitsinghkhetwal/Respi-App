import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Users } from "../models/users.model.js";
import { uploadCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import Jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import mongoose from "mongoose";

// now we 


dotenv.config({
  path: "./.env",
});

const GeneratejwtToken = (_id) => {
  const result = Jwt.sign({ _id }, process.env.ACCESS_TOKEN, {
    expiresIn: process.env.ACCESSTOKEN_EXPIRY,
  });
  return result;
};

const GenerateRefreshToken = (_id) => {
  const res = Jwt.sign({ _id }, process.env.REFRESH_TOKEN, {
    expiresIn: process.env.REFRSHTOKEN_EXPIRY,
  });
  return res;
};

const registerUser = asyncHandler(async (req, res) => {
  const { email, fullname, password, username } = req.body;

  if (
    [email, fullname, password, username].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existingUser = await Users.findOne({
    $or: [{ username }, { email }],
  });

  if (existingUser) {
    res.status(400).send({ message: "user already exist " });
  }

  const AvatarLocalPath = req.files?.avatar[0]?.path;
  let CoverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    CoverImageLocalPath = req.files.coverImage[0].path;
  }

  if (!AvatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  // we have to upload avatar in cloudnary it will async operation

  const avatar = await uploadCloudinary(AvatarLocalPath);
  const CoverImage = await uploadCloudinary(CoverImageLocalPath);

  if (!avatar) {
    throw new ApiError(400, "Avatar is required");
  }

  const HashedPassword = await bcrypt.hash(password, 12);

  const dbEntry = await Users.create({
    fullname,
    email,
    avatar: avatar.url,
    coverImage: CoverImage?.url || "",
    password: HashedPassword,
    username: username.toLowerCase(),
  });

  console.log("hey this is entry on database", dbEntry);

  return res
    .status(201)
    .json(new ApiResponse(200, dbEntry, "User registered successfully"));
});

const LoginUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  const NameCheck = await Users.findOne({
    $or: [{ username }, { email }],
  });
  if (!NameCheck) {
    new ApiResponse(400, "User doest exist");
  }

  const options = {
    httpOnly: true,
    secure: true,
  };

  const ComparePassword = await bcrypt.compare(password, NameCheck.password);
  if (ComparePassword) {
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
          CoverImage: NameCheck.coverImage,
        },
        message: "Login successfully",
      });
  } else {
    new ApiResponse(400, "Something went wrong here in loging in ===>");
  }
});

const LogoutUser = asyncHandler(async (req, res) => {
  await Users.findByIdAndUpdate(
    req.users._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("jwtToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User Logged Out Successfully"));
});

const refreshJwtToken = asyncHandler(async (req, resp) => {
  const incomingRefreshToken = req.cookies.jwtToken || req.body.jwtToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "unathorized request");
  }

  const decodedJwtToken = Jwt.verify(
    incomingRefreshToken,
    process.env.REFRESH_TOKEN
  );

  const user = await Users.findById(decodedJwtToken?._id);
  if (!user) {
    throw new ApiError(400, "Invalid refresh Token");
  }

  if (incomingRefreshToken != user?.refreshToken) {
    throw new ApiError(401, "Refresh Token is used or expired");
  }

  // we have checked all the condition if they meet we wil generate the new refresh token
  const options = {
    httpOnly: true,
    secure: true,
  };
  const GenerateNewRefreshToken = GenerateRefreshToken(user._id);
  const GenerateNewJwtToken = GeneratejwtToken(user._id);

  return resp
    .status(200)
    .cookie("jwtToken", GenerateNewRefreshToken, options)
    .cookie("refreshToken", GenerateNewJwtToken, options)
    .json(
      new ApiResponse(
        200,
        {
          GenerateNewJwtToken,
          GenerateNewRefreshToken,
        },
        "Access Token generated"
      )
    );
});

const changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;

  if (!(newPassword === confirmPassword)) {
    throw new ApiError(401, "Please enter correct password");
  }
  //if a user is able to change the password then he is logged in , so here,
  const user = await Users.findById(req.users?._id);
  const isPasswordCorrect = await bcrypt.compare(oldPassword, user.password);

  if (!isPasswordCorrect) {
    throw new ApiError(400, "Invalid old password");
  }

  const passwordHashing = await bcrypt.hash(newPassword, 12);

  user.password = passwordHashing;
  user.save({ validateBeforeSave: false });
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"));
});

const updateAccountDetail = asyncHandler(async (req, resp) => {
  const { username, email, fullname } = req.body;
  const MyUsers = await Users.findByIdAndUpdate(req.users?._id, {
    $set: {
        username,
        email,
        fullname
    },
  }, {
    new: true
  }).select("-password");

  return resp
  .status(200)
  .json(new ApiResponse(200, MyUsers, "Account Detail updated successfully"))
});

const updateAvatar = asyncHandler(async(req, res) => {
    const AvatarPath = req.file?.path;
    if(!AvatarPath){
        throw new ApiError(400, "Avatar file path is not found")
    }

    const avatarCloudnary = await uploadCloudinary(AvatarPath);
    if(!avatarCloudnary.url) {
        throw new ApiError(401, "Error while uploading file")
    }

    const result = await Users.findByIdAndUpdate(req.users?._id, {
      $set: {
        avatar: avatarCloudnary.url
      },
    }, 
    {
        new: true
    }).select("-password");

    return res
    .status(200)
    .json(new ApiResponse(
        200, result, "Avatar updated successfully"
    ))

})

const updateCoverImage = asyncHandler(async(req, res) => {
  const coverImagePath = req.file?.path;

  if(!coverImagePath){
    throw new ApiError(400, "CoverImage path not found");
  }

  const CoverCloudnary = await uploadCloudinary(AvatarPath);
  if(!CoverCloudnary.url){
    throw new ApiError(400, "error while uploading file")
  }

  const result = await Users.findByIdAndUpdate(req.users?._id, 
    {
      $set: {
        CoverImage: CoverCloudnary.url

      }
    }, {
      new: true
    }).select("-password");

    return res
    .status(200)
    .json(
      new ApiResponse(200, result, "CoverImage updated sucessfully!")
    )
})

const getUserChannelProfile = asyncHandler(async(req, resp) => {
  const {username} = req.params;
  console.log("request parameteres", req.params);
  if(!username?.trim()) {
    throw new ApiError(400, "username not found !!!!!")
  }

  const channel = await Users.aggregate([
    {
      $match: {
        username: username?.toLowerCase(),
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "channel",
        as: "subscribers",
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "subscriber",
        as: "SubscribedTo",
      },
    },
    {
      $addFields: {
        subscriberCount: {
          $size: "$subscribers",
        },
        subscriberSubscribedTo: {
          $size: "$SubscribedTo",
        },
        isSubscribed: {
          $cond: {
            if: { $in: [req.users?._id, "$subscribers.subscriber"]},
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $project: {
        username: 1,
        email: 1,
        fullname: 1,
        avatar: 1,
        coverImage: 1,
        subscriberCount: 1,
        subscriberSubscribedTo: 1,
        isSubscribed: 1
      },
    },
  ]); 

  if(!channel?.length) {
    throw new ApiError(404, "channel does not exist !" )
  }

  return resp
  .status(200)
  .json(
    new ApiResponse(200, channel, "Channel details fetched successfully !")
  )
})

const getWatchHistory = asyncHandler(async(req, resp) => {
  const result = await Users.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(req.users._id),
      },
    },
    {
      $lookup: {
        from: "vedios",
        localField: "watchHistory",
        foreignField: "_id",
        as: "watchHistory", 
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "owner",
              foreignField: "_id",
              as: "Owner", 
              pipeline: [
                {
                  $project:{
                    username: 1,
                    fullname: 1,
                    avatar: 1
                  }
                }
              ]
            }
          },
          //this lookup returns an array so for sake of simplicity we have to take out array's first element
          {
            $addFields: {
              owner: {
                $first: "$owner"
              }
            }
          }

        ]
      },
    },
  ]);
  return resp
  .status(200)
  .json(
    new ApiResponse(200, result[0].watchHistory, "Users WatchHistory fetched successfully !!!!")
  )
})


export {
  registerUser,
  LoginUser,
  LogoutUser,
  refreshJwtToken,
  changePassword,
  updateAccountDetail,
  updateAvatar,
  updateCoverImage,
  getUserChannelProfile,
  getWatchHistory,
};
