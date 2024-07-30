import dotenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";
import RoutesApp from "./routes/index.js";
import { connectDB } from "./db.js";
import cors from 'cors';
import morgan from "morgan";


const app = express();

dotenv.config();


// Configuración de CORS
const corsOptions = {
  origin: 'https://brightmind3.netlify.app', // Permitir solo este origen
  credentials: true, // Permitir enviar cookies de autenticación
  optionsSuccessStatus: 200 // Algunos navegadores (IE11, algunos SmartTVs) no soportan 204
};

app.use(cors(corsOptions)); // Registrar el middleware de CORS

app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.json());
app.use("/PE", RoutesApp);




export default app;
