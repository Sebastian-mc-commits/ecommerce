const isRegister = document.querySelector("#isRegister");
let isCodeunique = true;
const children = document.querySelector("#signUpFields").children;
const title = document.querySelector("#title");
const action = document.querySelector("#form");

const { useFetch } = globalMethods;

isRegister.addEventListener("click", () => {

    if (action.getAttribute("action") === "/api/auth/signup") {

        action.action = "/api/auth/login";
        title.textContent = "Log In";

        isRegister.textContent = "Don't you have an account?";

        if (children[0].hasAttribute("id")) {
            for (let child of children) {
                child.removeAttribute("id");
                child.disabled = true;
                child.value = "";
            }
        }
    }
    else if (action.getAttribute("action") === "/api/auth/login") {

        title.textContent = "Sing Up";
        isRegister.textContent = "Do you already have an account?";
        action.action = "/api/auth/signup"

        if (!children[0].hasAttribute("id")) {
            for (let child of children) {
                child.disabled = false;
                child.setAttribute("id", "field");
            }

        }

    };

    return validateFields();
})

action.addEventListener("submit", async function (event) {
    event.preventDefault();
    event.stopPropagation();

    const formData = new FormData(this);
    const data = Object.fromEntries(formData);

    let result = await useFetch({
        url: this.action,
        useLoader: this,
        method: "POST",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify(data)
    });

    if (result.request.ok && result.request.redirected) location.href = result.request.url;

});

action.querySelector("#sign-in_methods").onclick = function (event) {
    event.stopPropagation();
    event.preventDefault();

    const target = event.target;

    if (target.tagName !== "BUTTON") return;

    const methodSelected = target.dataset.method;

    if (methodSelected === "google") {
        console.log("google");
        location.href = "/api/auth/google"
    }
    else if (methodSelected === "github") {
        console.log("github");
        location.href = "/api/auth/github"
    }
}