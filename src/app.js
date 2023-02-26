import express from "express";
import { Server } from "socket.io";
import { create } from "express-handlebars";
import session from "express-session";
import flash from "connect-flash";
import dotenv from "dotenv";
import "./config/db.js"
import { auth, cart, crud_admin, home, listContent, realTimeProducts, user } from "./routers/index.js";
import __dirname from "./__dirname.js";
import helpers from "./lib/handlebars.js";
import { getAllProducts } from "./services/product.service.js";
import { getUserById, getUsers } from "./services/user.service.js";
import * as comments from "./services/comment.service.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { onAuthenticateSocket } from "./lib/middleware/socket/authentication.socket.js";
import passport from "passport";
import { authApiRouter, crudAdminApiRouter, productApiRouter, userApiRouter } from "./routers/api/index.js";
import userMessages from "./utils/messages/messages.user.utils.js";
import mongoConnect from "connect-mongo";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/public", express.static(__dirname("public")));

const sessionMiddleware = session({
    store: mongoConnect.create({
        mongoUrl: process.env.MONGO_URI
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
})
app.use(sessionMiddleware);
app.use(cors());

app.use(flash());
app.use((req, res, next) => {
    app.locals.message = req.flash("message")[0];
    app.locals.user = req.session.user;

    next();
});
app.use(passport.initialize());
app.use(passport.session());

app.use(cookieParser(process.env.SECRET_COOKIE));

//Set
const hbs = create({
    extname: ".hbs",
    helpers: helpers,
});
app.engine("hbs", hbs.engine);
app.set("views", __dirname("views"));
app.set("view engine", "hbs");
//Routers
app.use("/home", home);
app.use("/crud-admin", crud_admin);
app.use("/cart", cart);
app.use("/listContent", listContent);
app.use("/user", user);
app.use("/realTimeProducts", realTimeProducts);
app.use("/api/auth", authApiRouter);
app.use("/api/user", userApiRouter);
app.use("/api/crud-admin", crudAdminApiRouter);
app.use("/api/product", productApiRouter);
app.use("/auth", auth);
// http://localhost:4000/api/auth/github/callback

const server = app.listen(PORT, () => console.log("Server set on port ", PORT));

const io = new Server(server);

// const wrap = middleware => (socket, next) => {
//     return middleware(socket.request, {}, next);
// }

// io.use(wrap(sessionMiddleware));

// app.use((req, _, next) => {
//     req.io = io;
//     next();
// });



let handleConnectedSockets = [];
io.on("connection", async (socket) => {

    io.use(async (socket, next) => {
        const auth = socket.handshake.auth

        if (!auth) return next(userMessages.NOT_FOUND);

        socket.user = auth;

        if (socket.user.isSuperAdmin === "false") return next();

        if (handleConnectedSockets.length) {

            return socket.emit("connectedSockets", { connectedSockets: handleConnectedSockets }, (data) => {
                console.log("Received ACK from front end", data);
            });
        }

        for (let [socketId, connectedSockets] of io.of("/").sockets) {
            const authSocket = connectedSockets.handshake.auth;
            handleConnectedSockets.push({ authSocket, socketId });
        }
        socket.emit("connectedSockets", { connectedSockets: handleConnectedSockets }, (data) => {
            console.log("Received ACK from front end", data);
        });



        console.log("User")
        console.log(socket.user)
        return next();
    });

    let users = [];

    if (!socket.connected) {
        socket.connect();
    }

    socket.on("selectedRoom", async ({ room }) => {
        socket.join(room);
    });

    let products = await getAllProducts();
    socket.emit("getProducts", { products });

    socket.on("message", async ({ createdBy, productRef, room, rate, message }) => {
        const data = {
            rate: parseInt(rate),
            message,
            userCreator: createdBy
        }
        await comments.createComment(productRef, data);
        const getData = await comments.getComments(productRef);
        io.to(room).emit("data", { data: getData.comments });
    });

    io.use((socket, next) => {
        const { isAdmin = false } = socket.user;

        if (isAdmin || isAdmin === "false") return next(new Error("Unauthorized"));

        return next();
    });


    // if (socket.request?.session?.user?.superAdminOptions?.isSuperAdmin) {
    // }

    if (!users.length) {
        users = await getUsers();
    }

    // const getConnectedSockets = () => {
    //     // if (!socket?.username && socket.username?.isSuperAdmin === "false") return;


    //     return handleConnectedSockets.length ? handleConnectedSockets : [];
    // }

    socket.emit("getUsers", { users });

    socket.on("editedUser", async ({ email, _id, admin }) => {

        if (!users.length) users = await getUsers();

        const index = users.findIndex(({ auth }) => auth.email === email);
        let userUpdated

        if (index !== -1) {
            const [_, connectedSockets] = io.of("/");
            users[index].isConnected = connectedSockets.some(socket => socket.user.email === email);
            users.adminOptions.isAdmin = admin;
            userUpdated = users[index];
        }
        // else {
        //     userUpdated = await getUserById(_id);
        //     users.push(userUpdated);
        // }

        io.emit("showUserEdited", userUpdated);
    });

    socket.on("sendProduct", async ({ message, product, type = "delete" }) => {

        if (!!!products.length) {
            products = await getAllProducts();
        }

        else if (type === "delete") {
            products = products.filter(({ code }) => code !== product.code);
        }

        else if (type === "update") {
            const index = products.findIndex(({ code }) => code === product.code);

            if (index === -1) products.push(product);
            else {
                products[index] = product;
            }
        }

        else if (type === "add") {
            products.push(product);
        }

        io.emit("requestMessage", { message });
        io.emit("getProducts", { products });
    });

    // io.use((socket, next) => {
    //     const auth = socket.handshake.auth;
    //     console.log("auth");
    //     console.log(auth);

    //     if (!auth) return next("Not found");

    //     socket.username = auth;
    //     console.log("Middleware")
    //     next();
    // });

    // let connectedUsers = [];
    // for (let [id, socket] of io.of("/").sockets) {
    //     console.log("Render Sockets");
    //     const username = socket.handshake.auth?.username;

    //     if (!username) continue;
    //     connectedUsers.push({ username, id });
    // }

    // let dc = ["Hi", "hiw2"];
    // socket.on("sendMessageFromFront", ({ message, sendTo }) => {
    //     dc.push(message);
    //     socket.to(sendTo).emit("getMessages", { dc });
    // });

    // io.emit("sendConnectedUsers", { connectedUsers });

    // io.emit("getMessages", { dc });

    socket.on("connect_error", (err) => {
        console.log(`connect_error due to ${err.message}`);
    });

});