const user = document.querySelector("#user");
const product = document.querySelector("#product");
const socket = io();

socket.on("getData", ({ products, users }) => {
    try {
        printProducts(products);
        printUsers(users);
    } catch {
        document.querySelector("#handleData").innerHTML = `
            <p>Something went wrong</p>
        `;
    }

});

// const deleteUser = ({ name, id }) => {
//     Swal.fire({
//         title: `Are you sure you wanna delete User ${name}`,
//         showDenyButton: true,
//         showCancelButton: true,
//         confirmButtonText: "Continue",
//         denyButtonText: "Cancel"
//     }).then(({ isConfirmed, isDenied }) => {
//         if (isConfirmed) {
//             location.href(`/home/crud-admin/deleteUser/${id}`);
//         }
//         else if (isDenied) {
//             Swal.fire("Changes are not save", "", "info");
//         }
//     })
// }

const setUserToAdmin = ({ name, _id }) => {
    console.log("hi");
    Swal.fire({
        title: `Are you sure you wanna set ${name} to Admin`,
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "Continue",
    }).then(({ isConfirmed, isDenied }) => {
        if (isConfirmed) {
            Swal.fire({
                title: `Remember this user ${name} is gonna be able to perform the same as you do`,
                showDenyButton: true,
                showCancelButton: true,
                confirmButtonText: "Continue",
            }).then(({ isConfirmed, isDenied }) => {
                if (isConfirmed) location.href = `/crud-admin/setUserToAdmin/${_id}`;
                else if (isDenied) Swal.fire("Changes are not save", "", "info");
            })
        }
        else if (isDenied) {
            Swal.fire("Changes are not save", "", "info");
        }
    })
}


let data = [];


const printProducts = (productData) => {
    data = productData;
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

}

const printUsers = (userData) => {
    user.innerHTML = "";
    for (const { name, _id, email, last_name, isAdmin } of userData) {
        const requestId = JSON.stringify({ _id, name });
        let handleAdmin = `<button onclick='setUserToAdmin(${requestId})'>Set to Admin</button>`

        if (isAdmin) handleAdmin = "This user is an admin";

        user.innerHTML += `
            <tr class='text-center'>
            <td>${_id}</td>
            <td>${name}</td>
            <td>${last_name}</td>
            <td>${email}</td>
            <td class='text-end'>${handleAdmin}</td>
            </tr>`
    }

}