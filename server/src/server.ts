import express from "express";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import {AppDataSource} from "./data-source"

import authRoutes from './routes/auth'
import postRoutes from './routes/posts'
import likeRoutes from './routes/likes'
import RetweetRoutes from './routes/retweets'
import cookieParser from "cookie-parser";

const app = express();
const origin = "http://localhost:3000";
app.use(cors({
    origin,
    credentials:true
}))
dotenv.config(); 

app.use(express.json()); //app.use(): express.js에서 미들웨어 함수를 애플리케이션에 등록하는 메서드
app.use(morgan("dev"));
app.use(cookieParser());

app.get("/", (_, res) => res.send("server running"));

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/likes", likeRoutes);
app.use("/api/retweets", RetweetRoutes);

let port = process.env.PORT || 4000;

app.listen(port, async () => {
    console.log(`server running at http://localhost:${port}`);

    AppDataSource.initialize().then(async () => {

        console.log("database initializsed")
    
    }).catch(error => console.log(error));
    
})