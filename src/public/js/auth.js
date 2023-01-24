// import { emailRegex, passwordRegex } from "../../const/regex.js";

// // const password = document.querySelector("#password").textContent;
// // const email = document.querySelector("#email").textContent;
const isRegister = document.querySelector("#isRegister");
// const isCodeUnique = emailRegex.test(email) && passwordRegex.test(password);
let isCodeunique = true;
const children = document.querySelector("#singUpFields").children;
const title = document.querySelector("#title");
const action = document.querySelector("#form");

isRegister.addEventListener("click", () => {
    console.log(action.getAttribute("action"));

    if (action.getAttribute("action") === "/auth/singup") {

        action.setAttribute("action", "/auth/login");
        title.textContent = "Log In";

        isRegister.textContent = "Don't you have an account?";

        if (children[0].hasAttribute("id")) {
            for (let child of children) {
                console.log(child);
                child.removeAttribute("id");
                child.setAttribute("disabled", "");
                child.value = "";
            }
        }
    }
    else if (action.getAttribute("action") === "/auth/login") {

        title.textContent = "Sing Up";
        isRegister.textContent = "Do you already have an account?";
        action.setAttribute("action", "/auth/singup");

        if (!children[0].hasAttribute("id")) {
            for (let child of children) {
                child.removeAttribute("disabled");
                child.setAttribute("id", "field");
            }
        }

    };
})

// password.addEventListener("blur", () => {
//     const passwordMessage = document.querySelector("#passwordMessage");
//     if (!isCodeUnique) {
//         passwordMessage.textContent = `The password has to contain at least one uppercase letter,
//         at least one special character from !@#$%^&*,
//         at least one numeric digit,
//         at least one lowercase letter and
//         be at least 8 characters long`
//     }
// });