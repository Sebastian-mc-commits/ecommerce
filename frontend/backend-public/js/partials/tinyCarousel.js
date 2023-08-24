const carousel = document.querySelector("[data-carousel]");

(async () => {
    const request = await fetch("/home/getRandomProducts:api", {
        method: "GET"
    });

    if (!request.ok) return;

    const cookieData = await request.json();

    let HTML_TINYCAROUSEL = "";

    for (let { _id, price, thumbnail, title } of cookieData) {
        HTML_TINYCAROUSEL += `
        <div>
            <img src="${thumbnail}" alt="${title}" data-id="${_id}">

            <div>
                <h3>${title}</h3>
                <p> <strong>$</strong>${price}.</p>
            </div>
        </div>
    `;
    }

    if (cookieData.length > 2) {
        carousel.insertAdjacentHTML("afterbegin",
            `<button data-scroll="prev">&#8594;</button>
            <button data-scroll="next">&#8592;</button>`
        );
    }
    carousel.querySelector("#renderCarouselData").insertAdjacentHTML("afterbegin", HTML_TINYCAROUSEL);

    carousel.onclick = function (event) {

        const target = event.target;
        if (!!!target.dataset.id) return;

        location.href = `/listContent/${target.dataset.id}`;
    }

    let scrollto = 0;
    carousel.querySelectorAll("button").forEach(button => {
        button.onclick = async function (event) {
            event.stopPropagation();

            const target = event.target;

            if (!!target.dataset.scroll) {
                console.log(target);

                const isPrev = target.dataset.scroll === "prev";
                const elements = carousel.querySelector("div").querySelectorAll("div")
                const elementSize = [...elements].reduce((acc, element) => acc + element.getBoundingClientRect().width, 0) / elements.length - 1;

                if (isPrev) scrollto += elementSize;
                else scrollto -= elementSize;

                let max = Math.abs(carousel.querySelector("div").scrollWidth - carousel.querySelector("div").offsetWidth);

                scrollto = scrollto > max ? 0 : scrollto < 0 ? max : scrollto;

                carousel.querySelector("div").scrollTo({
                    top: 0,
                    left: scrollto,
                    behavior: "smooth"
                });
            }

            else if (!!target.dataset.clearCookie) {
                loader(carousel, "first");
                const request = await fetch("/home/clearProductCookies:api", {
                    method: "GET"
                });

                if (!request.ok) {
                    return hideLoader(carousel);
                };

                document.querySelector(target.dataset.clearCookie).classList.add("disableScale");
                hideLoader(carousel);
            }
        }
    });

})();

// const request = fetch("/home/getRandomProducts:api", {
//     method: "GET"
// }).then(data => data.json())
// .then(data => {
//     cookieData = data;
// });