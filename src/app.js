import express from 'express'
import cookieParser from 'cookie-parser';
import cors from 'cors'


const app = express();
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
  
);

app.use(express.json({
    limit: '100kb'
}))

app.use(express.urlencoded({extended: true, limit: '100kb'}))
app.use(express.static("public"))
app.use(cookieParser());

//importing the routes
import userRoutes from "./routes/user.routes.js";
import vediosRoute from "./routes/vedios.routes.js";
import PlaylistRoute from "./routes/playlist.routes.js"
import tweetRoutes from "./routes/tweet.routes.js"


app.use("/api/v1/users", userRoutes);
app.use("/api/v1/studyMaterial", vediosRoute);
app.use("/api/v1/creatingPlaylist", PlaylistRoute);
app.use("/api/v1/tweets", tweetRoutes);

export {app}
