const handleProduct = (products = {}, method = "") => {
    if (!Object.values(products).length) {
        return HTML = `<h3>Product/s not Found</h3>`
    }


    HTML = "";
    for (let { title, thumbnail, code, _id } of products.products) {
        if (method === "update") {
            method = `
                <div class="handleSelectedMethod">
                    <button class="bg-info" data-info=${_id}>Go to the product</button>
                </div>`;
        }

        else if (method === "delete") {
            method = `
                <div class="handleSelectedMethod">
                    <button class="bg-success" data-restore=${_id}>Restore</button>
                    <button class="bg-danger" data-delete=${_id}>Delete</button>
                </div>`;
        }
        else if (method === "create") method = "";
        // else method = "";

        HTML += `
        <div class="eachProduct">
        <div style="background-image: url(${thumbnail});" class="productTitle">
                        <h3>Code: ${code}</h3>
                    </div>

                    <div>
                        <h3>${title}</h3>
                        ${method}
                    </div >
                </div >
    `;
    }

    const productLength = products.count;

    HTML = `
        <p class="quantityDesign"> Quantity ${productLength}</p>
        ${HTML}
`;

    functionsMethods.activeOnChangeFunction();
    functionsMethods.onChangeFunction = () => selectedProductMethod();
}

const selectedProductMethod = () => {
    document.querySelector("[data-request]").addEventListener("click", async function (event) {
        console.log("Hi target");

        const dataset = event.target.dataset;

        if (!Object.values(dataset).length) return;

        if (dataset.delete) {

            let retrieveData = [];
            loader(event.target);

            let request = await fetch(`http://localhost:4000/api/product/irreversibleDelete/${dataset.delete}`, {
                method: "DELETE",
            });

            retrieveData = await request.json();

            hideLoader(event.target);

            if (!request.ok && "message" in retrieveData) {
                return activeGlobalMessage({
                    message: retrieveData.message,
                    type: "warning"
                });
            }

            else if (!request.ok) {
                return activeGlobalMessage({
                    message: "SERVER ERROR",
                    type: "warning"
                });
            }

            return activeGlobalMessageV2({
                message: retrieveData.message,
                type: "#84DE02"
            });
        }

        else if (dataset.restore) {

            let retrieveData = [];
            loader(event.target);

            let request = await fetch(`http://localhost:4000/api/product/restoreDeletedProduct/${dataset.restore}`, {
                method: "PUT",
            });

            retrieveData = await request.json();

            hideLoader(event.target);

            if (!request.ok && "message" in retrieveData) {
                return activeGlobalMessage({
                    message: retrieveData.message,
                    type: "warning"
                });
            }

            else if (!request.ok) {
                return activeGlobalMessage({
                    message: "SERVER ERROR",
                    type: "warning"
                });
            }

            return activeGlobalMessageV2({
                message: retrieveData.message,
                type: "#84DE02"
            });
        }
    });
}