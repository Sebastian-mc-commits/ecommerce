const user = document.querySelector("#user");

socket.on("getUsers", async users => {
    try {
        const dataUser = await users;
        user.innerHTML = "";
        for (const { name, _id, email, last_name } of dataUser) {
            const requestId = JSON.stringify({ _id, name });
            product.innerHTML += `
            <tr class='text-center'>
            <td>${id}</td>
            <td>${name}</td>
            <td>${last_name}</td>
            <td>${email}</td>
            <td class='text-end'><button onclick='setUserToAdmin("${requestId}")'>Set to Admin</button></td>
            </tr>`
        }
    } catch {
        product.innerHTML = `
            <tr class='text-center'>
            <td>Something went wrong</td>
            </tr>`
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
    Swal.fire({
        title: `Are you sure you wanna set ${name} to Admin`,
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "Continue",
        denyButtonText: "Cancel"
    }).then(({ isConfirmed, isDenied }) => {
        if (isConfirmed) {
            Swal.fire({
                title: `Remember this user ${name} is gonna be able to perform the same as you do`,
                showDenyButton: true,
                showCancelButton: true,
                confirmButtonText: "Continue",
                denyButtonText: "Cancel"
            }).then(({ isConfirmed, isDenied }) => {
                if (isConfirmed) location.href(`/home/crud-admin/setUserToAdmin/${_id}`);
                else if (isDenied) Swal.fire("Changes are not save", "", "info");
            })
        }
        else if (isDenied) {
            Swal.fire("Changes are not save", "", "info");
        }
    })
}