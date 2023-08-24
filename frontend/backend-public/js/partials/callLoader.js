const loader = (target, position = "last") => {
    let spinner = "<div class='loader'></div>";
    switch (position) {
        case "first":
            return target.insertAdjacentHTML("afterbegin", spinner);
        case "last":
            return target.innerHTML += spinner;
        default:
            return;
    }
}

const hideLoader = (parentTarget) => {
    parentTarget.removeChild(parentTarget.querySelector(".loader"));
}