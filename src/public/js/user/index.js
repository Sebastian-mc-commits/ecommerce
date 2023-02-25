const optionsContent = document.querySelector("#optionsContent");
const changeBody = document.querySelector("body");

const { loader, hideLoader, randomColor, activeGlobalMessage, functionsMethods, activeGlobalMessageV2, showCurrentUserValues } = globalMethods;
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

            loader(target);

            request = await fetch("http://localhost:4000/api/product/getCreatedByAdminProducts", {
                method: "GET",
            });

            result = await request.json();

            hideLoader(target);

            if (!request.ok && "message" in result) {

                return activeGlobalMessage({
                    message: result.message,
                    type: "warning"
                });
            }

            else if (!request.ok) {

                return activeGlobalMessage({
                    message: "SERVER ERROR",
                    type: "warning"
                });
            }

            retrieveData[getProducts] = result;

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

            loader(target);

            request = await fetch("http://localhost:4000/api/product/getDeletedProducts", {
                method: "GET",
            });

            result = await request.json();

            hideLoader(target);

            if (!request.ok && "message" in result) {

                return activeGlobalMessage({
                    message: result.message,
                    type: "warning"
                });
            }

            else if (!request.ok) {

                return activeGlobalMessage({
                    message: "SERVER ERROR",
                    type: "warning"
                });
            }

            retrieveData[getDeletedProducts] = result;
            handleProduct(retrieveData[getDeletedProducts], "delete");
            break;

        case getAdmin:
            return location.href = "/crud-admin&getAdmins";
        case getOrder:
            onHandleOrder(orders);
            break;
        case settings:
        case goToChat:

            if (goToChat in retrieveData) {
                handleRenderUsers(retrieveData[goToChat]);
                break;
            }

            loader(target);

            request = await fetch("http://localhost:4000/api/user/options", {
                method: "GET",
            });

            result = await request.json();
            console.log("result");
            console.log(result);

            hideLoader(target);

            if (!request.ok && "message" in result) {

                return activeGlobalMessage({
                    message: result.message,
                    type: "warning"
                });
            }

            else if (!request.ok) {

                return activeGlobalMessage({
                    message: "SERVER ERROR",
                    type: "warning"
                });
            }

            retrieveData[goToChat] = result;
            handleRenderUsers(retrieveData[goToChat]);
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