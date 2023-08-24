
const onHandleOrder = (orders) => {
    HTML = "";
    if (!orders) return HTML = "<h3>NOT FOUND</h3>";

    for (let { thumbnail, title, quantity, price, status } of orders) {
        HTML += `
            <div class="card default filter-blurried" data-viewport-scroll>
            <img src=${thumbnail}>
            <div class="productOrderOptions">
            <p>purchased: ${quantity} items</p>
            <p>Status: ${status}</p>
            </div>
            
            <div class="totalPrice">
                <h3>${title}</h3>
                <p><span>$${price}</span></p>
            </div>
            </div>
            `;
    }

    const onOrderPrice = 100000;
    const productLength = 5;

    HTML = `
        <div class="finalPurchase">
            <p>Quantity of products purchased <strong>${productLength}</strong></p>
            <p>Total: $${onOrderPrice}</p>
            <div>
                <p>1234rftghjuy7tgfryhujklo</p>
            </div>
        </div>
        <div class="orderDesign" id="handleOrderScroll" data-onscroll>
        ${HTML}
        </div>
        <button class="onSwitchViewArrow arrowDown" data-scroll-product="down">Down</button>
        <button class="onSwitchViewArrow arrowUp" data-scroll-product="up">Up</button>
    `;
    Object.defineProperty(helper, "onChangeFunction", {
        get: () => {
            const onReplaceFunction = this._onChangeFunction;
            delete helper.onChangeFunction;
            console.log("This could be more efficient, but i'll perform later");
            return onReplaceFunction;
        },
        set: (val) => {
            this._onChangeFunction = val;
        },
        configurable: true
    });
    helper.onChangeFunction = () => onHandleOrderScroll();
}

let y = 0;
const onHandleOrderScroll = () => {

    if ("buttons" in window) {
        console.log(true);
    }
    else {
        console.log(false);
    }

    const handleOrderScroll = document.querySelector("#handleOrderScroll");
    const elementOrderScroll = handleOrderScroll?.querySelectorAll("[data-viewport-scroll]");
    const buttons = document.querySelectorAll("[data-scroll-product]");

    const elementSize = [...elementOrderScroll].reduce((acc, element) => acc + element.getBoundingClientRect().width, 0) / elementOrderScroll.length - 1;

    let observer = new IntersectionObserver(entries => {

        entries.forEach(entry => {
            if (!entry.isIntersecting) return entry.target.classList.add("filter-blurried");;
            console.log("hi");
            return entry.target.classList.remove("filter-blurried");
        });
    }, {
        root: handleOrderScroll,
        threshold: 0.8,
    });

    elementOrderScroll.forEach(item => observer.observe(item));

    buttons.forEach(button => {

        return button.addEventListener("click", () => {
            const isDirectionDown = button.dataset.scrollProduct === "down";

            let max = (handleOrderScroll.scrollHeight - handleOrderScroll.getBoundingClientRect().width) - elementSize;
            if (!isDirectionDown) y -= elementSize;
            else if (isDirectionDown) y += elementSize;

            y = y < 0 ? max : y > max ? 0 : y;

            handleOrderScroll.scrollTo({
                top: y,
                left: 0,
                behavior: "smooth"
            });

        });
    });
}