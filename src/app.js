import dotenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";
import session from 'express-session';
import MongoStore from 'connect-mongo';
import RoutesApp from "./routes/index.js";
import { connectDB } from "./db.js";
import cors from 'cors';
import morgan from "morgan";

dotenv.config();

const app = express();

// Conectar a MongoDB
connectDB();

// Configuración de CORS
const corsOptions = {
  origin: 'https://brightmind3.netlify.app', // Permitir solo este origen
  credentials: true, // Permitir enviar cookies de autenticación
  optionsSuccessStatus: 200 // Algunos navegadores (IE11, algunos SmartTVs) no soportan 204
};

app.use(cors(corsOptions)); // Registrar el middleware de CORS

// Configuración de express-session
app.use(session({
  secret: process.env.SESSION_SECRET || 'tu_secreto', // Cambia esto por un secreto único
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }), // Almacenar sesiones en MongoDB
  cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 } // Ajusta según tus necesidades
}));

app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.json());
app.use("/PE", RoutesApp);

// Middleware de manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Algo salió mal!');
});

export default app;
