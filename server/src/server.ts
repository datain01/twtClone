import express from "express";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import {AppDataSource} from "./data-source"

import authRoutes from './routes/auth'

const app = express();
const origin = "http://localhost:3000";
app.use(cors({
    origin,
    credentials:true
}))
dotenv.config(); 

app.use(express.json());
app.use(morgan("dev"));

app.get("/", (_, res) => res.send("server running"));

app.use("/api/auth", authRoutes);

let port = process.env.PORT || 4000;

app.listen(port, async () => {
    console.log(`server running at http://localhost:${port}`);

    AppDataSource.initialize().then(async () => {

        console.log("database initializsed")
    
    }).catch(error => console.log(error));
    
})