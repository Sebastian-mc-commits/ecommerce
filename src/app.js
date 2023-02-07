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
import { onAuthenticateSocket } from "./lib/middleware/socket/authentication.socket.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/public", express.static(__dirname("public")));

const sessionMiddleware = session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
})
app.use(sessionMiddleware);

app.use(flash());
app.use((req, res, next) => {
    app.locals.message = req.flash("message")[0];
    // req.session.user = {
    //     adminOptions: { isAdmin: true, deletedProducts: [], updatedProducts: [] },
    //     superAdminOptions: {
    //         isSuperAdmin: true,
    //         usersSetToAdmin: [
    //             "63e0331e7c228b6dc2c6e054",
    //         ]
    //     },
    //     _id: "63e022a6040934599eb02a27",
    //     image: 'https://th.bing.com/th/id/R.6c6bff6f40d420c8a756db79a369681c?rik=suTO6OOqRmSAJQ&pid=ImgRaw&r=0',
    //     name: 'example',
    //     last_name: 'admin',
    //     email: 'admin@gmail.com',
    //     password: '$2a$10$.pSVUU4ogBN3jFGuxcc.iuDr7oyNTEgbDwPJSmNu2Non3Z2e8KFB6',
    //     cart: [],
    //     orders: [],
    //     __v: 0
    // }
    app.locals.user = req.session.user;

    next();
});

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

const server = app.listen(PORT, () => console.log("Server set on port ", PORT));

const io = new Server(server);

const wrap = middleware => (socket, next) => {
    return middleware(socket.request, {}, next);
}

io.use(wrap(sessionMiddleware));

app.use( (req, _, next) => {
    req.io = io;
    next();
});

app.use("/auth", auth);


io.on("connection", async (socket) => {
    let users = [];

    if (!socket.connected) {
        console.log("socket disconnected");
        console.log(socket.connected);
        socket.connect();
    }

    console.log("enter in io");
    // io.use( async (socket, next) => {
    //     const isUserAuthenticate = socket.request?.session?.user;

    //     console.log("isUserAuthenticate")
    //     console.log(!!isUserAuthenticate)
    //     if (!!isUserAuthenticate) return next();
    //     users = await getUsers();

    //     const newUser = {...isUserAuthenticate, isConnected: true}
    //     socket.broadcast.emit("getUsers", {users: {...users, ...newUser} });
    //     next();
    // });


    console.log("conected Users");


    socket.on("selectedRoom", async ({ room, productRef }) => {
        socket.join(room);
    });

    const products = await getAllProducts();
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

    // const isAuthenticate = socket.handshake.auth;
    // io.use(async (middlewareSocket, next) => {
    //     console.log("middleware");
    //     const { isAdmin } = socket.request?.session?.user?.adminOptions;

    //     if (!isAdmin) {
    //         console.log("middlewareAdmin");
    //         return next(new Error("Unauthorized"));
    //     }
    //     return next();
    // });
    // const isSuperAdmin = Boolean(isAuthenticate.superAdminOptions?.isSuperAdmin)<

    const isUserConnected = (users) => {
        for (let user of users) {
            let isConnected = false;
            for (let [_, socket] of io.of("/").sockets) {
                console.log("socket name");
                console.log(socket?.request?.session?.user?.name);
                if (socket.request?.session?.user?.email === user.email) {
                    isConnected = true;
                    break;
                }
            }
            user.isConnected = isConnected;
        }
    }

    // if (socket.request?.session?.user?.superAdminOptions?.isSuperAdmin) {
    // }
    users = await getUsers();
    isUserConnected(users);
    console.log("middlewareAuth");
    socket.emit("getUsers", { users });


    socket.on("editedUser", async ({ user }) => {

        if (!!!users.length) {
            console.log("Users not fount");
            users = await getUsers();
        }
        console.log("users");
        console.log(users);
        const index = users.findIndex(({ email }) => email === user.email);
        console.log("index");
        console.log(index);

        if (index !== -1) {
            const [_, connectedSockets] = io.of("/").sockets;
            const isConnected = connectedSockets?.some(connected => connected.request?.session?.user?.email === user.email);
            
            user.isConnected = isConnected || false;
            users[index] = user;
        }
        else {
            users.push(user);
        }

        socket.emit("getUsers", { users });
        socket.to(user._id).emit("userData", { user });
    });

    socket.on("sendProduct", async message => {
        io.emit("requestMessage", { message });
        io.emit("getProducts", { products });
    });

    socket.on("connect_error", (err) => {
        console.log(`connect_error due to ${err.message}`);
    });
});