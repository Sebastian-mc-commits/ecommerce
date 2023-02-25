const title_form = document.querySelector(".title_form");
const btn = document.querySelector("#btn");
const content = document.querySelector(".content");
const list_items = document.querySelector("#list_items");
const handleUpdate = document.querySelector("#handleUpdate");
const form = document.querySelector("#form");
const product = document.querySelector("#product");

btn.addEventListener("input", () => content.classList.toggle("translate"));

window.onload = () => {
    product.addEventListener("click", async function (event) {
        const dataset = event.target.dataset;

        if (!dataset.deleteProduct && !dataset.updateProduct) return;

        if (!!dataset.deleteProduct) {

            globalMethods.loader(event.target, "first")
            // const productOnDeleting = data.find(({ _id }) => dataset.deleteProduct === _id);

            const request = await fetch(`/api/crud-admin/deleteProduct/?pid=${dataset.deleteProduct}`, {
                method: "DELETE"
            });

            globalMethods.hideLoader(event.target);

            let result = await request?.json();

            if (!result) {
                return globalMethods.activeGlobalMessageV2({
                    message: "SERVER ERROR",
                    type: "warning"
                })
            };

            globalMethods.activeGlobalMessageV2(result.status);

            const userMessage = {
                message: `The product ${result.product.title} has been deleted`,
                type: "brown"
            }

            socket.emit("sendProduct", { message: userMessage, product: result.product });
        }
        else if (!!dataset.updateProduct) updateProduct(dataset.updateProduct);
    });
}
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

// const deleteProduct = async (data) => {
//     const { _id, title } = data;

//     const request = await fetch(`/api/crud-admin/deleteProduct/${_id}`, {
//         method: "DELETE"
//     });

//     let message = {
//         type: "brown",
//         message: "Error found"
//     }

//     if (!request.ok) return globalMethods.activeGlobalMessageV2(message);

//     let result = await request.json();

//     message = {
//         type: "#B30000",
//         message: `${title} Has been deleted. If you want to restore the product go to your account and deleted products`
//     }
//     globalMethods.activeGlobalMessageV2(message);

//     const userMessage = {
//         type: "brown",
//         message: `The product ${title} has been deleted`
//     }

//     return socket.emit("sendProduct", { message: userMessage, product: result });
// };


const updateProduct = (id_p) => {

    const { title, _id, description, price, stock, categoryType } = data.find(item => item._id === id_p);

    const handleUpdateOnMenu = document.querySelector("#handleUpdateOnMenu");
    handleUpdateOnMenu.textContent = `Update ${title}`;

    if (handleUpdateOnMenu.hasAttribute("hidden")) handleUpdateOnMenu.hidden = false;

    if (document.querySelector("#update_form")) {
        const fields = {
            categoryType,
            title,
            description,
            price,
            stock
        }

        document.querySelector("#update_form").dataset.formId = _id;
        for (let field in fields) {
            document.querySelector("#update_form").querySelector(`[name=${field}]`).value = fields[field];
        }
        return;
    };

    handleUpdate.innerHTML = `<form class="form card" id="update_form" data-form-id='${_id}'>
    <div class="group">
    <input type="text" id="title_for_update" placeholder="Title" value=${title} name="title" />
      <input type="number" step='0.01' placeholder="price" name="price" value='${price}'/>
      </div>
      <div class="group">
      <label for="status">
      <p>Set status to false</p>
      <input type="checkbox" name="status" value="false" />
      </label>
      <input type="number" placeholder="Stock" name="stock" value='${stock}'/>
      <input type="text" id="field" name="categoryType" placeholder="Category" value='${categoryType}'>
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

    document.querySelector("#update_form").addEventListener("submit", async function (event) {
        event.preventDefault();
        const formData = new FormData(this);
        const data = Object.fromEntries(formData);

        globalMethods.loader(this);
        const request = await fetch(`/api/crud-admin/updateProduct/${this.dataset.formId}`, {
            method: "PUT",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify(data)
        });
        globalMethods.hideLoader(this);

        let result = await request.json();

        if (!request.ok && "status" in result) {
            return globalMethods.activeGlobalMessageV2(result.status);
        }

        else if (!result && !result?.product) {
            return globalMethods.activeGlobalMessageV2({
                message: "SERVER ERROR",
                type: "brown"
            });
        }

        const userMessage = {
            type: "#B30000",
            message: `New product ${title} added`
        }

        handleUpdateOnMenu.textContent = `Update ${result.product.title}`;

        socket.emit("sendProduct", {
            message: userMessage,
            product: result.product,
            type: "update"
        });

        return globalMethods.activeGlobalMessageV2(result.status);
    });
}


form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    globalMethods.loader(form);

    const request = await fetch("/api/crud-admin/addProduct", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    globalMethods.hideLoader(form);

    let result = await request.json();

    if (!request.ok && "status" in result) {
        return globalMethods.activeGlobalMessageV2(result.status);
    }

    else if (!result && !result?.product) {
        return globalMethods.activeGlobalMessageV2({
            message: "SERVER ERROR",
            type: "brown"
        });
    }

    const userMessage = { type: "#84DE02", message: `${title_form.value} Added` }

    socket.emit("sendProduct", {
        message: userMessage,
        product: result.product,
        type: "add"
    });

    return globalMethods.activeGlobalMessageV2(result.status);
}
);

const existUpdateValues = () => {
    if (document.querySelector("#update_form")) {
        return console.log(true);
    }
    return console.log(false);
};