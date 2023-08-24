const socket = io();
const formChat = document.querySelector("#formChat");
const chat = document.querySelector("#chat");
const commentsLength = document.querySelector("#commentsLength");
const comment = document.querySelector("#comment");
const user = document.querySelector("#user");
const room = document.querySelector("#room").textContent;
const productRef = document.querySelector("#productRef").textContent;

let exisUser = "";

socket.emit("selectedRoom", { room, productRef });

formChat.addEventListener('submit', e => {
    e.preventDefault();

    const rate = document.querySelectorAll("#rate");
    const selectedRate = [...rate].find(item => item.checked);
    console.log("Comming to form");

    socket.emit("message", {
        room,
        message: comment.value,
        rate: selectedRate.value,
        productRef,
        createdBy
    });
    /*socket.emit("message", {
        from: socket.id, 
        message: message.value
    });*/
    comment.value = "";
});

function printData(data) {
    console.log(data);
    if (!data) return chat.innerHTML = "<h2>No Comments Found</h2>"
    chat.innerHTML = "";
    commentsLength.textContent = data.length;
    for (const { rate, message, userCreator } of data) {
        try {
            chat.innerHTML += `<h3>Rate: ${rate}</h3>
                <li><h3>${userCreator.name}</h3>says: <br> ${message}</li>`;
        }
        catch {
            chat.innerHTML = "<h2>Render error</h2>"
        }
    }
}

socket.on("data", async ({ data }) => printData(data));

// const registerUser = () => {
//     if (exisUser) return;
//     Swal.fire({
//         title: "¡Hi there!",
//         input: "text",
//         text: "Your name is required",
//         allowOutsideClick: false,
//         inputValidator: (value) => {
//             return !value && "The field must not be empty";
//         },
//     }).then((newUser) => {
//         exisUser = newUser.value;
//         user.textContent = newUser.value;
//     });
// }