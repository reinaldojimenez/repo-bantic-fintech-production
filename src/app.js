import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import loginRoutes from "./routes/login.routes";
import usersRoutes from "./routes/users.routes";
import cobranzaRoutes from "./routes/cobranza.routes";
import cookieParser from 'cookie-parser';
import {version} from './../package.json'
//import './database/database.js'; //Prueba
import cors from 'cors'

dotenv.config();

const app = express();

app.use(cors({
    origin: [process.env.ORIGIN_CORS],
    //origin: '*', 
    credentials: true //tambien vas a poder establecer las cookies
}));

//Settings
const PORT = process.env.PORT || 3000;
app.set("PORT", PORT);

//Middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());

//Routes
app.use("/api/v1/auth", loginRoutes);
app.use("/api/v1/users", usersRoutes);
app.use("/api/v1/cobranza", cobranzaRoutes);

app.get("/", (req, res) => {
    res.send("Raiz del proyecto")
});

app.get("/api/v1/version", (req, res) => {
    res.send(`La version del producto es ${version}`)
});

app.use( (req, res, next) => {
    res.status(404).json({
        message: "ruta no encontrada"
    });
});


export default app;