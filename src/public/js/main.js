const currentView = document.querySelector("#currentView").textContent;
console.log("currentView");
console.log(currentView);
if (currentView !== "home") {
    const element = document?.querySelector(`#${currentView}`);
    if (element) {
        element.innerHTML = "<strong>Go back</strong>";
        element.href = "/home"
    }
}

const userView = () => location.href = "/user";