import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";

const ConnectDB = async() => {
    try{
        const DB = await mongoose.connect(`${process.env.MONGO_URI}`);
        
        if(DB){
            console.log("Connection established successfully");
        }
    }catch(err){
        console.log("ERROR", err);
        throw(err);
    }
}

 export default ConnectDB;