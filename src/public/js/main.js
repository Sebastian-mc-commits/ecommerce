const currentView = document.querySelector("#currentView").textContent;

if (currentView !== "home"){
    const element = document.querySelector(`#${currentView}`);
    element.innerHTML = "<strong>Go back</strong>";
    element.href = "/home"
}

const userView = () => location.href = "/user";