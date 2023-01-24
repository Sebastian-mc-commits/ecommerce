const messageCode = document.querySelector("#messageCode");
const product = document.querySelector("#product");
const title_form = document.querySelector(".title_form");
const btn = document.querySelector("#btn");
const content = document.querySelector(".content");
const list_items = document.querySelector(".list-items");
const update = document.querySelector("#update");
const form = document.querySelector("#form");

btn.addEventListener("input", () => content.classList.toggle("translate"));

const socket = io();

// socket.on("requestMessage", text => {
//     const {type, message} = text.message;
//     console.log(`type: ${type} message: ${message}`)
//     Swal.fire({
//         text: message,
//         toast: true,
//         position: "top-righ",
//         color: type
//     });
// });

const message_crud = JSON.parse(localStorage.getItem("message")) || "";

if (message_crud) {
    const { type, message } = message_crud;
    Swal.fire({
        text: message,
        toast: true,
        position: "top",
        color: type
    });
    localStorage.removeItem("message");
}

//On press side-bar options
list_items.addEventListener("click", e => {
    const list_content = document.querySelectorAll(".list-content");
    const target = e.target;

    if (!target.getAttribute("id")) return;

    let y = 0;

    for (let i of [...list_content]) i.style.color = "#f2f2f2";

    switch (target.getAttribute("id")) {

        case "go_to_table":
            y = product.getBoundingClientRect().y
            target.style.color = "burlywood";
            break;
        case "go_to_create":
            y = 0
            target.style.color = "burlywood";
            break;
        case "go_to_update":
            y = update.getBoundingClientRect().y;
            target.style.color = "burlywood";
            break;
        case "go_to_home":
            location.href = "/home";
            break;
        case "go_to_user":
            y = document.querySelector("#userOptions").getBoundingClientRect.y;
            target.style.color = "burlywood";
            break;
    }

    // console.log("y: ", update.scrollTop());
    window.scrollTo({
        top: y && y + window.scrollY,
        left: 0,
        behavior: "smooth"
    });

});


let data = [];
let isCodeunique = true;

socket.on("getProducts", async ({products}) => {
    console.log(products);
    try {
        data = await products;
        product.innerHTML = ``;
        for (const { title, _id, code } of data) {
            const requestId = JSON.stringify({ _id, title });
            product.innerHTML += `
            <tr class='text-center'>
            <td>${_id}</td>
            <td>${title}</td>
            <td>${code}</td>
            <td class='text-end'><button onclick='deleteProduct(${requestId})'>Delete</button></td>
            <td class='text-end'><button onclick='updateProduct("${_id}")'>update</button></td>
            </tr>`
        }
    } catch {
        product.innerHTML = `
            <tr class='text-center'>
            <td>Something went wrond</td>
            </tr>`
    }
});

const deleteProduct = (data) => {
    const { _id, title } = data
    const message = { type: "#B30000", message: `${title} Has been deleted` }
    socket.emit("sendProduct", message);
    localStorage.setItem("message", JSON.stringify(message));
    location.href = `/home/delete/${_id}`;
};


const updateProduct = (id_p) => {
    const { title, _id, description, price, stock } = data.find(item => item._id === id_p);
    const sendProduct = (bool = true) => {
        const title_for_update = document.querySelector("#title_for_update");
        const message = {
            type: "#84DE02",
            message: `${title} Updated to ${title_for_update.value}`
        }
        if(bool) localStorage.setItem("message", JSON.stringify(message));
        return socket.emit("sendProduct", message);
    }

    const update_form = document.querySelector("#update_form") || "";

    if (update_form) update_form.removeEventListener("submit", sendProduct(false));

    update.innerHTML = `<form class="form card" id="update_form" action="/home/updateProduct/${_id}" method="POST">
    <div class="group">
      <input type="text" id="title_for_update" placeholder="Title" value=${title} name="title" />
      <input type="number" placeholder="price" name="price" value='${price}'/>
    </div>
    <div class="group">
      <label for="status">
        <p>Set status to false</p>
        <input type="checkbox" name="status" value="false" />
      </label>
      <input type="number" placeholder="Stock" name="stock" value='${stock}'/>
    </div>

    <div class="commentContent">
      <textarea
        name="description"
        rows="10"
        placeholder="Description"
      >${description}</textarea>
    </div>
    <input type="submit" value="Done" />
  </form>`

  //SHow the option for updating
    const showFeatureUpdate = document.querySelector("#go_to_update");
    showFeatureUpdate.textContent = `Update ${title}`;
    if (showFeatureUpdate.hasAttribute("hidden")) showFeatureUpdate.removeAttribute("hidden");

    document.querySelector("#update_form").addEventListener("submit", () => sendProduct());
}


form.addEventListener("submit", () => {

    const message = { type: "#84DE02", message: `${title_form.value} Added` }
    localStorage.setItem("message", JSON.stringify(message));
    socket.emit("sendProduct", message)
}
);