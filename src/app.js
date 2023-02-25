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
import { getUsers } from "./services/user.service.js";
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



io.on("connection", async (socket) => {

    io.use((socket, next) => {
        const auth = socket.handshake.auth

        if (!auth) return next(userMessages.NOT_FOUND);

        socket.user = auth;
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

        console.log("isAdmin")
        console.log(isAdmin)
        if (!isAdmin) return next(new Error("Unauthorized"));

        return next();
    });

    const isUserConnected = (users) => {
        if (!socket.user) return;
        for (let user of users) {
            let isConnected = false;
            for (let [_, socket] of io.of("/").sockets) {
                // console.log("socket name");
                // console.log(socket?.request?.session?.user?.name);
                if (socket.user.email === user.email) {
                    isConnected = true;
                    break;
                }
            }
            user.isConnected = isConnected;
        }
    }

    // if (socket.request?.session?.user?.superAdminOptions?.isSuperAdmin) {
    // }

    if (!users.length) {
        users = await getUsers();
    }

    isUserConnected(users);
    socket.emit("getUsers", { users });


    // socket.on("editedUser", async ({ email, isAdmin = false }) => {

    //     if (!users.length) {

    //         users = await getUsers();
    //         return io.emit("getUsers", { users });

    //     }
    //     const index = users.find(({ auth }) => auth.email === email);

    //     if (index !== -1) {
    //         const [_, connectedSockets] = io.of("/").sockets;
    //         const isConnected = connectedSockets?.some(connected => connected.user.email === email);

    //         // user.isConnected = isConnected || false;
    //         console.log(users[index]);
    //         users[index].adminOptions.isAdmin = isAdmin;
    //     }

    //     io.emit("getUsers", users);
    // });

    socket.on("sendProduct", async ({ message, product, type = "delete" }) => {
        console.log("hi");

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