import mongoose from "mongoose";
import bcrypt from "bcrypt"
import dotenv from "dotenv"
import jwt from "jsonwebtoken"

dotenv.config({
  path: "./.env",
});

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    fullname: {
      type: String,
      required: true,
      trim: true,
    },
    avatar: {
        type: String,
        required: true,
    },
    coverImage: {
        type: String,
    },
    watchHistory: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Vedio'
        }
    ],
    password: {
        type: String,
        required: [true, 'Password is required'],
    }, 
    refreshToken: {
        type: String,
        
    }

  },
  {
    timestamps: true,
  }
);

// UserSchema.pre("save", async function(next){
//   if(!this.isModified("password")) return next();
//   try{
//     this.password = await bcrypt.hash(this.password, 10);
//     next();
//   }catch(error){
//     next(error);
//   }   
// })

// UserSchema.methods.isPasswordCorrect = async function (password) {
//   return await bcrypt.compare(password, this.password);
// }

// (UserSchema.methods.generateToken = function () {
//   return jwt.sign(
//     {
//       _id: this._id,
//       email: this.email,
//       username: this.username,
//       fullName: this.fullname,
//     },
//     process.env.ACCESS_TOKEN,
//     {
//       expiresIn: process.env.ACCESSTOKEN_EXPIRY,
//     }
//   );
// }),
//   console.log("THis is accsess token", process.env.ACCESS_TOKEN);

// UserSchema.methods.generateRefreshToken = function(){
//   return jwt.sign(
//     {
//       _id: this._id,
//     },
//     process.env.REFRESH_TOKEN,
//     {
//       expiresIn: process.env.REFRSHTOKEN_EXPIRY,
//     }
//   );
// }

export const Users = mongoose.model('Users', UserSchema);