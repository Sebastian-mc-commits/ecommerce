import express from "express";
import { createServer } from "http";
import session from "express-session";
import "./config/db.js";
import {
  authRouter,
  cartRouter,
  homeViewRouter,
  productRouter,
  userRouter
} from "./routes/index.js";
import __dirname from "./__dirname.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import passport from "passport";
import mongoConnect from "connect-mongo";
// import SocketIo from "./utils/functions/socketHandler.utils.js";
import errorMiddleware from "./lib/middleware/errorMiddleware.middleware.js";
import flash from "connect-flash"
import config from "./config/config.js";

const { PORT, SESSION_SECRET, MONGO_URI, SECRET_COOKIE, LOCALHOST_CORS } =
  config;
const app = express();

const httpServer = createServer(app);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/public", express.static(__dirname("public")));

const sessionMiddleware = session({
  store: mongoConnect.create({
    mongoUrl: MONGO_URI
  }),
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false
});
app.use(sessionMiddleware);
app.use(flash())
app.use(
  cors({
    origin: LOCALHOST_CORS
  })
);

app.use((req, res, next) => {
  app.locals.user = req.session.user;

  next();
});
app.use(passport.initialize());
app.use(passport.session());

app.use(cookieParser(SECRET_COOKIE));

app.use("/api/user", userRouter);
app.use("/api/home", homeViewRouter);
app.use("/api/product", productRouter);
app.use("/api/auth", authRouter);
app.use("/api/cart", cartRouter);

app.use(errorMiddleware);
httpServer.listen(PORT, () => console.log("Server set on port ", PORT));

// SocketIo(httpServer);
