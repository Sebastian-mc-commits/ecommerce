import { Server as WebSocketServer } from "socket.io";

const SocketIo = (server) => {
  const io = new WebSocketServer(server);
  io.on("connection", async (socket) => {

    io.use(async (socket, next) => {
        const auth = socket.handshake.auth

        if (!auth) return next(userMessages.NOT_FOUND);

        socket.user = auth;

        io.emit("isSocketConnected", {
            socket: auth,
            isSocketConnected: true
        });
        return next();
    });

    socket.on("disconnect", () => {

        io.emit("isSocketConnected", {
            socket: socket.user,
            isSocketConnected: false
        });
    });

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

        if (!isAdmin) return next(new Error(userMessages.ADMIN_ONLY));

        return next();
    });

    // let users = [];

    // // if (socket.request?.session?.user?.superAdminOptions?.isSuperAdmin) {
    // // }

    // if (!users.length) {
    //     console.log("Not exist user");
    //     users = await getUsers();

    //     for (let user of users) {

    //         let isConnected = false;

    //         for (let [_, connectedSockets] of io.of("/").sockets) {
    //             // console.log("connectedSockets");
    //             // console.log(connectedSockets.handshake.auth);
    //             if (connectedSockets.handshake.auth?.email === user.auth.email) {
    //                 isConnected = true;
    //                 break;
    //             }
    //         }
    //         user.isConnected = isConnected;
    //     }
    // }
    let connectedUsers = [];

    const populateConnectedUsers = async () => {
        return await new Promise((resolve) => {
            for (let [socketId, connectedSockets] of io.of("/").sockets) {
                const user = connectedSockets.handshake.auth;
                if (user) {
                    connectedUsers.push({ ...user, socketId });
                }
            }
            resolve();
        });
    };

    // Rest of front end code goes here...

    socket.on("editedUser", async ({ message, userUpdated }) => {

        if (!connectedUsers.length) {
            await populateConnectedUsers();
        }
        const sendUpdate = connectedUsers.find(({ email }) => email === userUpdated.auth.email);

        console.log("sendUpdate");
        console.log(sendUpdate);
        if (sendUpdate) {

            socket.to(sendUpdate.socketId).emit("sendUpdate", { userUpdated });
        }
        io.emit("showUserEdited", { userUpdated, message });
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

    socket.on("getCurrentUsers", async () => {

        if (!connectedUsers.length) {
            const callSocket = fork("/");
            return callSocket.send({
                connectedUsers: async () => await populateConnectedUsers()
            });
        }

        socket.emit("connectedUsers", { connectedUsers });

    });

    process.on("connectedUsers", (connectedUsers) => {
        socket.emit("getUsersConnected", { connectedUsers });
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

    socket.on("getCCC", () => console.log("Hello fella"));

    socket.on("connect_error", (err) => {
        console.log(`connect_error due to ${err.message}`);
    });

});
}

export default SocketIo