import express from "express";
import morgan from "morgan";
import cors from "cors";
import http from "http";
import dotenv from "dotenv";
import {AppDataSource} from "./data-source"
import cookieParser from "cookie-parser";

import authRoutes from './routes/auth'
import postRoutes from './routes/posts'
import likeRoutes from './routes/likes'
import bookmarkRoutes from './routes/bookmarks'
import RetweetRoutes from './routes/retweets'
import userRoutes from './routes/users'
import { Server } from "socket.io";
import { initializeIo } from "./socket";


const app = express();
const origin = "http://localhost:3000";
app.use(cors({
    origin,
    credentials:true
}))
dotenv.config(); 

const httpServer = http.createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: origin,
        methods: ["GET", "POST"]
    }
});
initializeIo(io);

app.use(express.json()); //app.use(): express.js에서 미들웨어 함수를 애플리케이션에 등록하는 메서드
app.use(morgan("dev"));
app.use(cookieParser());

app.get("/", (_, res) => res.send("server running"));

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/likes", likeRoutes);
app.use("/api/retweets", RetweetRoutes);
app.use("/api/users", userRoutes);
app.use("/api/bookmarks", bookmarkRoutes);

app.use(express.static("public"));

io.on("connection", (socket) => {
    console.log(`클라이언트 연결 아이디: ${socket.id}`)
    socket.on("subscribe-to-notification", (userId) => {
        socket.join(`notifications-${userId}`);
    })
})

let port = process.env.PORT || 4000;

httpServer.listen(port, async () => {
    console.log(`server running at http://localhost:${port}`);

    AppDataSource.initialize().then(async () => {

        console.log("database initializsed")
    
    }).catch(error => console.log(error));
    
})