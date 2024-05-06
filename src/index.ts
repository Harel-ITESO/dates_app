// app entry point
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUri from "swagger-ui-express";
import indexRoutes from "./routes/index.routes";
import path from "path";
import { engine } from "express-handlebars";
import cookieParser from "cookie-parser";
import cors from "cors";
import passport from "passport";

import { swaggerConfig } from "./config/swagger.config";
import SocketIO from "./socket/socket";
import "./config/passport-google"; // -> passport google strategy setup
import cookieSession from "cookie-session";

// app setup
const app = express();
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use(
  cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: [process.env["SECRET_KEY"] || ""],
  }),
);

app.use(passport.initialize());
app.use(passport.session());

// path for jquery on the client and static files
app.use(
  "/lib/jquery",
  express.static(path.join(__dirname, "../node_modules/jquery/dist")),
);
app.use("/public", express.static(path.join(__dirname, "../public")));

// routing
app.use(indexRoutes);

// Swagger
const swaggerDocs = swaggerJsDoc(swaggerConfig); // Genera los documentos
app.use("/api-docs", swaggerUri.serve, swaggerUri.setup(swaggerDocs));

// app listening
const port = process.env["PORT"] || 3000;
const uri = `http://localhost:${port}`;
const appServer = app.listen(port, () =>
  console.log("app is running on " + uri),
);

// socket io
const io = new SocketIO(appServer);
io.setSocketAppFunctionalities();
