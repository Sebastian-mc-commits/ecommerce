const user = document.querySelector("#user");
// const socket = io({auth});
const { activeGlobalMessage, activeGlobalMessageV2, showCurrentUserValues, showConfirmationMessage, useFetch, randomColor } = globalMethods;
randomColor();
const userValues = showCurrentUserValues();
const socket = io({ auth: userValues });

let data = [];
let userData = [];

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

socket.on("showUserEdited", userUpdated => {


    const element = Array.from(document.querySelectorAll("[data-id]")).find(el => el.dataset?.id === userUpdated._id);

    if (element) {

        element.closest("tr").innerHTML = printUser(userUpdated);
    }

    return activeGlobalMessage({
        message: userUpdated.adminOptions.isAdmin ? `${userUpdated.name} is now an admin` : `${userUpdated.name} is not longer an admin`,
        type: userUpdated.adminOptions.isAdmin ? "success" : "warning"
    });
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

const setUserToAdmin = ({ name, _id, email }, method = true, target) => showConfirmationMessage({
    title: `Are you sure you wanna ${method ? "set" : "unset"} ${name} to Admin`,
    onConfirmTitle: `Remember this user ${name} is ${method ?
        "gonna be able to perform the same as you do"
        :
        "no longer an admin"
        }`
}, async () => {
    let { request } = await useFetch({
        url: `/api/crud-admin/${method ? "setUserToAdmin" : "unsetToAdmin"}/${_id}`,
        useLoader: target,
        method: "PUT"
    });

    if (request.ok) return socket.emit("editedUser", { email, _id, admin: method });
}
);

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

const printUser = ({ _id, adminOptions, name, last_name, auth }) => {
    let handleAdmin = `<button data-set-admin='true' data-id=${_id}>Set to Admin</button>`

    if (adminOptions.isAdmin) {
        handleAdmin = "This user is an admin"
        if (getUser.superAdminOptions.isSuperAdmin) {
            handleAdmin += `
                <button data-id=${_id} data-set-admin='false'>
                    Unset to Admin
                </button>`
        }
    };

    // <td class="userMessage" onclick="notifyUser('${_id}')">${name}</td>
    // <td><span class=${isConnected ? "success bg-success" : "danger bg-danger"}>&#9737; &#8213; ${isConnected}</span></td>
    return `
        <tr class='text-center'>
        <td>${_id}</td>
        <td>${name}</td>
        <td>${last_name}</td>
        <td>${auth.email}</td>
        <td class='text-end'>
            ${handleAdmin}
        </td>
        </tr>`
}

const printUsers = (users) => {
    user.innerHTML = "";
    userData = users;
    console.log(users);
    for (const { name, _id, auth, last_name, adminOptions } of userData) {
        if (getUser._id === _id) continue;
        user.innerHTML += printUser({ name, _id, auth, last_name, adminOptions });
    }

}

const notifyUser = (_id) => location.href = `/user/visitUser?_id=${_id}`;

document.querySelector("[data-render-users]").onclick = async function (event) {
    const target = event.target;
    const dataset = target.dataset;

    if (!Object.values(dataset).length) return;

    if (dataset.setAdmin) {
        console.log(target.closest("tr"));
        const { name, _id, email } = userData.find(({ _id }) => _id === dataset.id);

        setUserToAdmin({
            name,
            _id,
            email
        },
            dataset.setAdmin === "true", target);
    }

    else if (dataset.loadResults) {
        let { request, result } = await useFetch({
            method: "GET",
            useLoader: target,
            url: `/api/crud-admin/getUsers?skip=${dataset.loadResults}`
        });

        if (request.ok) {

            if (!result.length) {
                delete target.dataset.loadResults;
                target.style.cursor = "default";
                return target.textContent = "You reached the bottom";
            }

            userData.push(...result);
            randomColor();

            for (let { name, _id, auth, last_name, adminOptions } of result) {

                user.innerHTML += printUser({ name, _id, auth, last_name, adminOptions });
            }
            dataset.loadResults = parseInt(dataset.loadResults) + 10;
        }
    }
}

socket.on("connectedSockets", ({ connectedSockets }, ack) => {
    console.log("Connected sockets:", connectedSockets);
    ack({ message: "Received connectedSockets data" });
  });
  