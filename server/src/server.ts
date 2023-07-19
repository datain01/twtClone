import express from "express";
import morgan from "morgan";
import {AppDataSource} from "./data-source"

const app = express();

app.use(express.json());
app.use(morgan("dev"));

app.get("/", (_, res) => res.send("server running"));

let port = process.env.PORT || 4000;

app.listen(port, async () => {
    console.log(`server running at http://localhost:${port}`);

    AppDataSource.initialize().then(async () => {

        console.log("database initializsed")
    
    }).catch(error => console.log(error))
    
})