const wrapQuantity = document.querySelector("#wrapQuantity");
const stock = document.querySelector("#stock");

wrapQuantity.addEventListener("input", (e) => {
    const target = e.target;

    if (parseInt(target.value) > parseInt(target.dataset.quantity)) {
        return target.value = target.dataset.quantity
    }
    else if (target.value < 0) return target.value = 1;
})