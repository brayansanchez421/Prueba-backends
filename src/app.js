import dotenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";
import RoutesApp from "./routes/index.js";
import { connectDB } from "./db.js";
import cors from 'cors';
import morgan from "morgan";


const app = express();

dotenv.config();


// ToDo: app.on()
app.use(cors({
    origin: 'https://brightmind3.netlify.app', 
    credentials: true

}));

app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.json());
app.use("/PE", RoutesApp);



export default app;
