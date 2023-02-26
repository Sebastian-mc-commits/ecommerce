randomColor();

let data = [];

// const crudAdminMethods = {
//     reachedTheBottom: false
// }

socket.on("getProducts", async ({ products }) => {
    console.log("products");
    try {
        printProducts(products);
    } catch {
        product.innerHTML = `
            <p>Something went wrong</p>
        `;
    }

});

const printProducts = (productData) => {
    data = productData;
    product.innerHTML = ``;
    for (const { title, _id, code, categoryType } of data) {
        product.innerHTML += `
            <tr class='text-center'>
                <td>${_id}</td>
                <td>${categoryType}</td>
                <td>${title}</td>
                <td>${code}</td>
                <td class='text-end'><button data-delete-product="${_id}">Delete</button></td>
                <td class='text-end'><button data-update-product="${_id}">update</button></td>
            </tr>`
    }

}