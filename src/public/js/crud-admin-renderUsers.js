const printUser = ({ _id, adminOptions, name, last_name, auth, isConnected }) => {
    let handleAdmin = `<button data-set-admin='true' data-id=${_id}>Set to Admin</button>`

    if (adminOptions.isAdmin) {
        handleAdmin = "This user is an admin"
        if (userValues.isSuperAdmin) {
            handleAdmin += `
            <button data-id=${_id} data-set-admin='false'>
                Unset to Admin
            </button>`
        }
    };

    return `
<tr class='text-center'>
    <td data-is-connected=${isConnected} class=${isConnected ? "bg-success" : "bg-danger"}><span class='connected'>&#9737;</span></td>
    <td>${_id}</td>
    <td data-user-name=${name} class="messageToUser optionsFromAdminToUser" onclick="notifyUser(${_id})">${name}</td>
    <td>${last_name}</td>
    <td class="visitUser optionsFromAdminToUser">${auth.email}</td>
    <td class='text-end'>
        ${handleAdmin}
    </td>
    </tr>`
}
const renderUsers = async (renderUsersData) => {

    const user = document.querySelector("#user");

    for (const { name, _id, auth, last_name, adminOptions } of renderUsersData) {
        if (userValues._id === _id) continue;

        const isConnected = false;
        console.log(auth.email);
        user.innerHTML += printUser({ name, _id, auth, last_name, adminOptions, isConnected });
    }

    socket.on("showUserEdited", ({ userUpdated, message }) => {


        const element = Array.from(document.querySelectorAll("[data-id]")).find(el => el.dataset?.id === userUpdated._id);

        if (element) {

            element.closest("tr").innerHTML = printUser(userUpdated);
        }

        return activeGlobalMessage({
            message,
            type: userUpdated.adminOptions.isAdmin ? "success" : "warning"
        });
    });

    socket.on("isSocketConnected", ({ socket, isSocketConnected }) => {
        let element = Array.from(document.querySelectorAll("[data-id]")).find(el => el.dataset?.id === socket._id);

        if (element) {
            console.log("element");
            const connectedElement = element.closest("tr").querySelector("td[data-is-connected]");
            console.log(connectedElement);

            if (!connectedElement.classList.contains("bg-success") && isSocketConnected) {
                connectedElement.classList.remove("bg-danger");
                connectedElement.classList.add("bg-success");
            }

            else if (!connectedElement.classList.contains("bg-danger") && !isSocketConnected) {
                connectedElement.classList.remove("bg-success");
                connectedElement.classList.add("bg-danger");

            }
        }

    });

    const setUserToAdmin = ({ name, _id }, method = true, target) => showConfirmationMessage({
        title: `Are you sure you wanna ${method ? "set" : "unset"} ${name} to Admin`,
        onConfirmTitle: `Remember this user ${name} is ${method ?
            "gonna be able to perform the same as you do"
            :
            "no longer an admin"
            }`
    }, async () => {
        let { request, result } = await useFetch({
            url: `/api/crud-admin/${method ? "setUserToAdmin" : "unsetToAdmin"}/${_id}`,
            useLoader: target,
            method: "PUT"
        });

        if (request.ok) return socket.emit("editedUser", {
            message: result.message,
            userUpdated: result.user,
        });
    }
    );

    const notifyUser = (_id) => location.href = `/user/visitUser?_id=${_id}`;

    document.querySelector("[data-render-users]").onclick = async function (event) {
        const target = event.target;
        const dataset = target.dataset;

        if (!Object.values(dataset).length) return;
        const parentValues = target.closest("tr");

        if (dataset.setAdmin) {

            setUserToAdmin({
                name: parentValues.querySelector("[data-user-name]").textContent,
                _id: dataset.id,
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

                randomColor();

                for (let { name, _id, auth, last_name, adminOptions } of result) {

                    user.innerHTML += printUser({ name, _id, auth, last_name, adminOptions });
                }
                dataset.loadResults = parseInt(dataset.loadResults) + 10;
            }
        }
    }

}
//i may need it in the future.
// const tryGetConnection = () => {
//     console.log(userValues);
//     socket.connect();
//     socket.user = userValues;
//     socket.emit("getCCC");
// }

// socket.on("getUsersConnected", ({ connectedUsers }) => {
//     console.log("connectedUsers")
//     console.log(connectedUsers)
// });

socket.on('connect_error', (error) => {
    // Handle the connection error here
    console.log(`Connection error: ${error.message}`);
});

// const printUsers = (users) => {
    //     user.innerHTML = "";
    //     userData = users;
    //     for (const { name, _id, auth, last_name, adminOptions, isConnected } of userData) {
    //         if (userValues._id === _id) continue;
    //         user.innerHTML += printUser({ name, _id, auth, last_name, adminOptions, isConnected });
    //     }

    // }

    // socket.on("getUsers", async ({ users }) => {
    //     try {
    //         console.log("users");
    //         console.log(users);
    //         printUsers(users);
    //     } catch {
    //         user.innerHTML = `
    //             <p>Something went wrong</p>
    //         `;
    //     }

    // });