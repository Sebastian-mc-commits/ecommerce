const currentView = document.querySelector("#currentView").textContent;

if (currentView !== "home") {

    const element = document?.querySelector(`[data-location=${currentView}]`);
    if (element) {
        const homeView = document.createElement("p");
        homeView.classList.add("main-menu-home-view");
        homeView.textContent = "Home";
        homeView.dataset.location = "home"

        element.parentNode.replaceChild(homeView, element);
    }
}

document.querySelector("#main-menu").onclick = (event) => {
    const dataset = event.target.dataset;

    console.log(event.target);
    if (!dataset.location) return;

    return location.href = `/${dataset.location}`;
}