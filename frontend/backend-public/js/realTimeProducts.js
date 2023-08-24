const products = document.querySelector("#products");
const socket = io();

socket.on("requestMessage", text => {
    const { type, message } = text.message;
    console.log(`type: ${type} message: ${message}`)
    Swal.fire({
        text: message,
        toast: true,
        position: "top-righ",
        color: type
    });
});

socket.on("getProducts", async ({products}) => {
    console.log("data");
    console.log(products);
    try {
        await renderProducts(products);
    } catch {
        products.innerHTML = `<div class='center text-warning'><h1>Something is wrong</h1></div>`
    }
});

function renderProducts(data) {
    products.innerHTML = "";
    console.log(data);
    for (let { thumbnail, title, price, code, status, stock, _id } of data) {
        products.innerHTML += `
            <div class="card w-3">
                <img
                src=${thumbnail}
                alt="Product Image"
                class="w-10"
                />
                <h1>${title}</h1>
                <p>Price: ${price}</p>
                <p>Code: ${code}</p>
                <p>Status: ${status}</p>
                <p>Stock: ${stock}</p>
                <button>
                    <a href="/cart/addToCart/${_id}" class="text">Add to cart</a>
                </button>

                <button><a href="/listContent/${_id}" class="text">Watch more</a></button>
            </div>`
    }
}