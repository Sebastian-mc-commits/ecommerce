const openModal = document.querySelectorAll("[data-modal-target]");
const closeModal = document.querySelectorAll("[data-close-button]");
const overlay = document.querySelector("#overlay");
const content = document.querySelector("#content");
const getSelectedTypes = document.querySelector("[data-selected]");

let selectedTypes = [];

openModal.forEach(button => {
    return button.addEventListener("click", () => {
        const modal = document.querySelector(button.dataset.modalTarget);
        if (modal.classList.contains("active")) return;
        return handleOpenModal(modal);
    });
});

closeModal.forEach(button => {
    return button.addEventListener("click", () => {
        const modal = button.closest("#modal");
        return handleCloseModal(modal);
    });
});

const handleOpenModal = (modal) => {
    if (!modal) return;
    modal.classList.add("active");
    overlay.classList.add("active");
}

const handleCloseModal = (modal) => {
    if (!modal) return;
    modal.classList.remove("active");
    overlay.classList.remove("active");
}

const modal_footer = getSelectedTypes.closest(".modal-footer");
content.addEventListener("input", () => {
    selectedTypes = [...content.children].filter(element => element.children[0].checked);

    if (!!selectedTypes.length) return modal_footer.classList.remove("display-none");
    else return modal_footer.classList.add("display-none");
});

getSelectedTypes.addEventListener("click", () => {
    const modal = getSelectedTypes.closest("#modal");
    for (let i = 0; i < selectedTypes.length; i++) {

        if (![...showSelectedTypes.children].includes(selectedTypes[i])) {
            // let element = selectedTypes[i].cloneNode(true);
            showSelectedTypes.insertAdjacentElement("afterbegin", selectedTypes[i]);
        }
    }
    handleCloseModal(modal);
    return modal_footer.classList.add("display-none");
});