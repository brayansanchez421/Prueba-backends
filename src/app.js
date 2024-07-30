import dotenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";
import RoutesApp from "./routes/index.js";
import { connectDB } from "./db.js";
import cors from 'cors';
import morgan from "morgan";
import session from 'express-session';
import MongoStore from 'connect-mongo';

dotenv.config();

const app = express();

// Conexión a la base de datos
connectDB();

app.use(cors({
    origin: 'https://brightmind3.netlify.app',
    credentials: true
}));
app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.json());

// Configuración de la sesión
app.use(session({
    secret: process.env.SESSION_SECRET || 'your_secret_key',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI,
        collectionName: 'sessions'
    }),
    cookie: {
        maxAge: 1000 * 60 * 60 * 24, // 1 día
        secure: true, // Cambiar a true si estás en producción con HTTPS
        sameSite: 'lax', // Cambiar a 'none' si estás utilizando HTTPS
    }
}));

app.use("/PE", RoutesApp);

export default app;
