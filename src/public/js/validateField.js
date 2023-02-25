const field = document.querySelectorAll("#field");
const activeButton = document.querySelector("#activeButton");

document.querySelector("#form").addEventListener("input", () => validateFields());

const validateFields = () => {
    const field = document.querySelectorAll("#field");
    const condition = [...field].every(item => item.value);

    if (condition && isCodeunique) return activeButton.removeAttribute("disabled");

    return activeButton.hasAttribute("disabled") || activeButton.setAttribute("disabled", "");
}