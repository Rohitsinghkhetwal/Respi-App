import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Users } from "../models/users.model.js";
import jwt  from "jsonwebtoken";

export const verifyJwt = asyncHandler(async(req, _, next) => {
    try{
        const Token = req.cookies?.jwtToken || req.header("Authorization")?.replace("Bearer", "");
        console.log("user token access", Token);

        if(!Token){
            throw new ApiError(401, "Unothorized Token user not found");
        }

        const decodedToken = jwt.verify(Token, process.env.ACCESS_TOKEN);
        const myUser = await Users.findById(decodedToken._id).select(
          "-password -refreshToken"
        );

        if(!myUser){
            throw new ApiError(400, "Invalid access token")
        }
        req.users = myUser;
        next();


    }catch(err){
        throw new ApiError(401,err || "Invalid access token")

    }

})