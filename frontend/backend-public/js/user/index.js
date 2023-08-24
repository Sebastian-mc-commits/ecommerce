const optionsContent = document.querySelector("#optionsContent");
const changeBody = document.querySelector("body");

const { loader, hideLoader, randomColor, activeGlobalMessage, functionsMethods, activeGlobalMessageV2, showCurrentUserValues, useFetch } = globalMethods;
console.log("showCurrentUserValues")
console.log(showCurrentUserValues())

const caseValues = {
    getProducts: "getProducts",
    getUpdatedProducts: "getUpdatedProducts",
    getDeletedProducts: "getDeletedProducts",
    getAdmin: "getAdmin",
    getOrder: "getOrder",
    settings: "settings",
    goToChat: "goToChat"
}

const retrieveData = {}
let request = "";
randomColor();


let HTML = "<h3>Not found</h3>";
optionsContent.addEventListener("click", async e => {
    const target = e.target;

    const existRequest = target.closest("div").querySelector(".handleRequest");
    if (!target.hasAttribute("data-text")) return;

    else if (!!existRequest) {
        return existRequest.parentNode.removeChild(existRequest);
    }

    let result;
    const { getProducts, getDeletedProducts, getAdmin, getOrder, getUpdatedProducts, goToChat, settings } = caseValues;
    switch (target.getAttribute("data-option")) {

        case getProducts:

            if (getProducts in retrieveData) {
                handleProduct(retrieveData.getProducts, "create");
                break;
            }

            result = await useFetch({
                url: "http://localhost:4000/api/product/getCreatedByAdminProducts",
                method: "GET",
                useLoader: target
            });

            if (!result.request.ok) return;

            retrieveData[getProducts] = result.result;

            handleProduct(retrieveData.getProducts, "create");
            break;

        case getUpdatedProducts:
            handleProduct(retrieveData.getDeletedProducts, "update");
            break;
        case getDeletedProducts:

            if (getDeletedProducts in retrieveData) {
                handleProduct(retrieveData[getDeletedProducts], "delete");
                break;
            }

            result = await useFetch({
                url: "http://localhost:4000/api/product/getDeletedProducts",
                method: "GET",
                useLoader: target
            });

            if (!result.request.ok) return;

            retrieveData[getDeletedProducts] = result.result;

            handleProduct(retrieveData[getDeletedProducts], "delete");
            break;

        case getAdmin:
            return location.href = "/crud-admin&getAdmins";
        case getOrder:
            onHandleOrder(orders);
            break;
        case settings:
        case goToChat:

            console.log("goToChat");
            if (goToChat in retrieveData) {
                handleRenderUsers(retrieveData[goToChat]);
                break;
            }

            result = await useFetch({
                method: "GET",
                url: "http://localhost:4000/api/user/options",
                useLoader: target
            });

            console.log(result);
            if (!result.request.ok) return;

            retrieveData[goToChat] = result.result;
            handleRenderUsers(result.result);
            break;

    }

    changeBody.style.backgroundColor = "var(--options-color)";

    const parentTarget = target.parentNode;

    if (!parentTarget) return;

    parentTarget.innerHTML += `
    <div class="handleRequest" data-request>
    <span class="goBack" onclick="handleGoBack()">&#8592;</span>
        ${HTML}
        </div>`;

    if ("onChangeFunction" in functionsMethods) functionsMethods.onChangeFunction();

    // if ("lastFn" in fnKeeper) fnKeeper.lastFn();

    const handleRequest = document.querySelector("[data-request]");

    const onScrollProduct = handleRequest.getBoundingClientRect();

    window.scrollTo({
        top: onScrollProduct.y,
        left: onScrollProduct.x,
        behavior: "smooth"
    });

    socket.emit("Hi");
});

const handleGoBack = () => {
    window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth"
    });
    const handleRequest = document.querySelector(".handleRequest");
    handleRequest.parentNode.removeChild(handleRequest);
    changeBody.style.backgroundColor = "var(--default)";
}

const handleLogout = () => location.href = "/api/auth/logout";
//flutter
// maute pwa
//mvvn