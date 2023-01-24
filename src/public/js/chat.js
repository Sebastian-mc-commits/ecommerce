const socket = io();
const formChat = document.querySelector("#formChat");
const chat = document.querySelector("#chat");
const commentsLength = document.querySelector("#commentsLength");
const comment = document.querySelector("#comment");
const user = document.querySelector("#user");
const room = document.querySelector("#productRef").textContent;

let exisUser = "";

socket.emit("selectedRoom", room);

formChat.addEventListener('submit', e => {
    e.preventDefault();
    const header = document.querySelector("#header").textContent;

    const rate = document.querySelectorAll("#rate");
    const selectedRate = [...rate].find(item => item.checked);

    socket.emit("message", {
        room,
        header,
        message: comment.value,
        rate: selectedRate.value,
        productRef,
        createBy
    });
    /*socket.emit("message", {
        from: socket.id, 
        message: message.value
    });*/
    comment.value = "";
});

function printData(data) {
    chat.innerHTML = "";
    commentsLength.textContent = data.length;
    for (const { rate, header, message, createdBy } of data) {
        chat.innerHTML += `<h3>Rate: ${rate}</h3>
            <li><h3>${header}</h3> ${createdBy.name} says: <br> ${message}</li>`;
    }
}

socket.on("data", async data => printData(data) );

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