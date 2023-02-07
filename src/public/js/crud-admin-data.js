const user = document.querySelector("#user");
const product = document.querySelector("#product");
// const socket = io({auth});
const socket = io();

let data = [];
let userData = [];

socket.on("getProducts", async ({ products }) => {
    console.log("products");
    console.log(products);
    try {
        printProducts(products);
    } catch {
        product.innerHTML = `
            <p>Something went wrong</p>
        `;
    }

});

socket.on("newUser", ({ user }) => {
    console.log("Connected New User");
    console.log("connected ", user)
    if (!!!userData.length) return;
    const index = userData.findIndex(({ email }) => email === user.email);

    if (index !== -1) {
        userData[index].isConnected = true;
    }
    else {
        userData.push({ ...user, isConnected: true });
    }
    printUsers(userData);
    // console.log("userData");
    // console.log(userData);

});

socket.on("getUsers", async ({ users }) => {
    console.log("users");
    console.log(users);
    try {
        printUsers(users);
    } catch {
        user.innerHTML = `
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

const setUserToAdmin = ({ name, _id }, method = true) => {
    Swal.fire({
        title: `Are you sure you wanna ${method ? "set" : "unset"} ${name} to Admin`,
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "Continue",
    }).then(({ isConfirmed, isDenied }) => {
        if (isConfirmed) {
            Swal.fire({
                title: `Remember this user ${name} is ${method ?
                    "gonna be able to perform the same as you do"
                    :
                    "no longer an admin"
                    }`,
                showDenyButton: true,
                showCancelButton: true,
                confirmButtonText: "Continue",
            }).then(async ({ isConfirmed, isDenied }) => {
                if (isConfirmed) {
                    // location.href = `/crud-admin/setUserToAdmin/${_id}`
                    let request = await fetch(`/crud-admin/${method ?
                        "setUserToAdmin"
                        :
                        "unsetToAdmin"
                        }/${_id}`, {
                        method: "PUT",
                    });

                    if (request.ok) {
                        const result = await request.json();
                        socket.emit("editedUser", { user: result });
                        const message = {
                            type: "#84DE02",
                            message: `${result.name} ${method ? "set" : "unset"} to admin successfully`
                        }

                        showMessage(message);
                    }
                }
                else if (isDenied) Swal.fire("Changes are not save", "", "info");
            })
        }
        else if (isDenied) {
            Swal.fire("Changes are not save", "", "info");
        }
    })
}

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

const printUsers = (users) => {
    user.innerHTML = "";
    userData = users;
    for (const { name, _id, email, last_name, adminOptions, isConnected } of userData) {
        if (getUser._id === _id) continue;

        const requestId = JSON.stringify({ _id, name });
        let handleAdmin = `<button onclick='setUserToAdmin(${requestId})'>Set to Admin</button>`

        if (adminOptions.isAdmin) {
            handleAdmin = "This user is an admin"
            if (getUser.superAdminOptions.isSuperAdmin) {
                handleAdmin += `
                <button onclick='setUserToAdmin(${requestId}, false)'>
                    Unset to Admin
                </button>`
            }
        };

        user.innerHTML += `
            <tr class='text-center'>
            <td><span class=${isConnected ? "success bg-success" : "danger bg-danger"}>&#9737; &#8213; ${isConnected}</span></td>
            <td>${_id}</td>
            <td class="userMessage" onclick="notifyUser('${_id}')">${name}</td>
            <td>${last_name}</td>
            <td>${email}</td>
            <td class='text-end'>
                ${handleAdmin}
            </td>
            </tr>`
    }

}

const notifyUser = (_id) => location.href = `/user/visitUser?_id=${_id}`;