const title_form = document.querySelector(".title_form");
const btn = document.querySelector("#btn");
const content = document.querySelector(".content");
const list_items = document.querySelector("#list_items");
const handleUpdate = document.querySelector("#handleUpdate");
const form = document.querySelector("#form");

btn.addEventListener("input", () => content.classList.toggle("translate"));

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
    const target = e.target;

    if (target === list_items) return;
    
    const slides = document.querySelector("[data-slides]");
    const activeSlide = slides.querySelector("[data-active]");

    let newIndex = [...list_items.children].indexOf(target);
    const currentEqualPrev = list_items.children[newIndex].classList.contains("onPressLi");

    if (currentEqualPrev) return;

    const prevIndex = [...slides.children].indexOf(activeSlide);
    
    list_items.children[newIndex].classList.add("onPressLi");
    console.log(newIndex);
    slides.children[newIndex].dataset.active = true;
    list_items.children[prevIndex].classList.remove("onPressLi");
    delete activeSlide.dataset.active;


});

let isCodeunique = true;

const deleteProduct = (data) => {
    const { _id, title } = data
    const message = { type: "#B30000", message: `${title} Has been deleted` }
    socket.emit("sendProduct", message);
    localStorage.setItem("message", JSON.stringify(message));
    location.href = `/crud-admin/delete/${_id}`;
};


const updateProduct = (id_p) => {
    const { title, _id, description, price, stock } = data.find(item => item._id === id_p);
    const sendProduct = (bool = true) => {
        const title_for_update = document.querySelector("#title_for_update");
        const message = {
            type: "#84DE02",
            message: `${title} Updated to ${title_for_update.value}`
        }
        if (bool) localStorage.setItem("message", JSON.stringify(message));
        return socket.emit("sendProduct", message);
    }

    const update_form = document.querySelector("#update_form") || "";

    if (update_form) update_form.removeEventListener("submit", sendProduct(false));

    handleUpdate.innerHTML = `<form class="form card" id="update_form" action="/crud-admin/updateProduct/${_id}" method="POST">
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
    const handleUpdateOnMenu = document.querySelector("#handleUpdateOnMenu");
    handleUpdateOnMenu.textContent = `Update ${title}`;
    if (handleUpdateOnMenu.hasAttribute("hidden")) handleUpdateOnMenu.removeAttribute("hidden");

    document.querySelector("#update_form").addEventListener("submit", () => sendProduct());
}


form.addEventListener("submit", () => {

    const message = { type: "#84DE02", message: `${title_form.value} Added` }
    localStorage.setItem("message", JSON.stringify(message));
    socket.emit("sendProduct", message)
}
);