const user = document.querySelector("#user");
// const socket = io({auth});
const { activeGlobalMessage, activeGlobalMessageV2, showCurrentUserValues } = globalMethods;
const userValues = showCurrentUserValues();
const socket = io({ auth: userValues });

let data = [];
let userData = [];

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

const setUserToAdmin = ({ name, _id, email }, method = true) => {
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

                    let retrieveData = [];

                    let request = await fetch(`/api/crud-admin/${method ?
                        "setUserToAdmin"
                        :
                        "unsetToAdmin"
                        }/${_id}`, {
                        method: "PUT",
                    });

                    retrieveData = await request.json();

                    if (!request.ok && "message" in retrieveData) {
                        return activeGlobalMessage({
                            message: retrieveData.message,
                            type: "warning"
                        });
                    }

                    else if (!request.ok) {
                        return activeGlobalMessage({
                            message: "SERVER ERROR",
                            type: "warning"
                        });
                    }

                    // socket.emit("editedUser", { email, isAdmin: method === "setUserToAdmin" });
                    return activeGlobalMessageV2({
                        message: retrieveData.message,
                        type: "#84DE02"
                    });

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
    for (const { title, _id, code, categoryType } of data) {
        product.innerHTML += `
            <tr class='text-center' id='abcde'>
                <td>${_id}</td>
                <td>${categoryType}</td>
                <td>${title}</td>
                <td>${code}</td>
                <td class='text-end'><button data-delete-product="${_id}">Delete</button></td>
                <td class='text-end'><button data-update-product="${_id}">update</button></td>
            </tr>`
    }

}

const printUsers = (users) => {
    user.innerHTML = "";
    userData = users;
    for (const { name, _id, auth, last_name, adminOptions, isConnected } of userData) {
        if (getUser._id === _id) continue;

        const requestId = JSON.stringify({ _id, name, email: auth.email });
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

        // <td class="userMessage" onclick="notifyUser('${_id}')">${name}</td>
        user.innerHTML += `
            <tr class='text-center'>
            <td><span class=${isConnected ? "success bg-success" : "danger bg-danger"}>&#9737; &#8213; ${isConnected}</span></td>
            <td>${_id}</td>
            <td>${name}</td>
            <td>${last_name}</td>
            <td>${auth.email}</td>
            <td class='text-end'>
                ${handleAdmin}
            </td>
            </tr>`
    }

}

const notifyUser = (_id) => location.href = `/user/visitUser?_id=${_id}`;