const handleProduct = (products = [], method = "") => {
    if (!products) {
        return HTML = `<h3>Product/s not Foundt</h3>`
    }

    if (method === "update") {
        method = `
        <div class="handleSelectedMethod">
            <button class="info">Go to the product</button>
        </div>`;
    }

    else if (method === "delete") {
        method = `
        <div class="handleSelectedMethod">
            <button class="success">Restore</button>
            <button class="danger">Delete</button>
        </div>`;
    }
    else method = "";

    HTML = "";
    for (let { title, thumbnail, code } of products) {
        HTML += `
                <div class="eachProduct">
                    <div style="background-image: url(${thumbnail});" class="productTitle">
                        <h3>${title}</h3>
                    </div>

                    <div>
                        <p>Code: ${code}</p>
                        ${method}
                    </div>
                </div>
            `;
    }

    const productLength = products.length;

    HTML = `
        <p class="quantityDesign">Quantity ${productLength}</p>
        ${HTML}
    `;
}