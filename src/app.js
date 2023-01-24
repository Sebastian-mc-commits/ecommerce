import express from "express";
import { Server } from "socket.io";
import { create } from "express-handlebars";
import session from "express-session";
import flash from "connect-flash";
import dotenv from "dotenv";
import "./config/db.js"
import { auth, cart, home, listContent, realTimeProducts, user } from "./routers/index.js";
import __dirname from "./__dirname.js";
import helpers from "./lib/handlebars.js";
import { getProducts } from "./services/product.service.js";
import { getUsers } from "./services/user.service.js";
import * as comments from "./services/comment.service.js";

dotenv.config();


const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/public", express.static(__dirname("public")));
app.use(session({
    secret: "iFoundThisWay",
    resave: false,
    saveUninitialized: false
}));
app.use(flash());
app.use((req, res, next) => {
    app.locals.message = req.flash("message")[0];
    app.locals.user = req.session.user;
    next();
});
//Set
const hbs = create({
    extname: ".hbs",
    helpers: helpers
});
app.engine("hbs", hbs.engine);
app.set("views", __dirname("views"));
app.set("view engine", "hbs");
//Routers
app.use("/home", home);
app.use("/cart", cart);
app.use("/listContent", listContent);
app.use("/user", user);
app.use("/realTimeProducts", realTimeProducts);
app.use("/auth", auth);

const server = app.listen(PORT, () => console.log("Server set on port 4000"));

const io = new Server(server);

io.on("connection", async (socket) => {

    // io.use((socket, next) => {
    //     const token = socket.handshake.auth;
    //     next(token);
    // });

    socket.on("selectedRoom", room => {
        // socket.rooms.delete;
        socket.join(room);
    });

    socket.on("message", async ({ createBy, productRef, room, rate, header, message }) => {
        const data = {
            rate,
            header,
            message
        }
        await comments.createComment(createBy, productRef, { ...data });
        const getData = await comments.getComments(productRef);
        io.to(room).emit("data", { data: getData });
    });

    const products = await getProducts();
    socket.emit("getProducts", { products });
    socket.emit("getUsers", { users: async () => await getUsers() });

    socket.on("sendProduct", message => {
        io.emit("requestMessage", { message });
        io.emit("getProducts", { products: async () => await getProducts() });
    });

    socket.on("connect_error", (err) => {
        console.log(`connect_error due to ${err.message}`);
    });
});