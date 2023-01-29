const optionsContent = document.querySelector("#optionsContent");
const changeBody = document.querySelector("body");
let helper = {};

const orders =
    [
        {
            title: "example2sssssssssssssssssssssssssssssssssssssssss",
            price: 1000000000000002,
            stock: 4,
            desription: "lorem",
            thumbnail: "https://th.bing.com/th/id/OIP.oTAts-vs68T4vch6Q0smQwHaFe?pid=ImgDet&rs=1",
            code: "dddddddddddddddddddddddddddddddddddddddddddddddd",
            status: true
        },
        {
            title: "example22",
            price: 12,
            stock: 4,
            desription: "lorem",
            thumbnail: "https://th.bing.com/th/id/OIP.oTAts-vs68T4vch6Q0smQwHaFe?pid=ImgDet&rs=1",
            code: "sas22",
            status: true
        },
        {
            title: "example11",
            price: 12,
            stock: 4,
            desription: "lorem",
            thumbnail: "https://th.bing.com/th/id/OIP.oTAts-vs68T4vch6Q0smQwHaFe?pid=ImgDet&rs=1",
            code: "sas22",
            status: true
        },
        {
            title: "example2",
            price: 12,
            stock: 4,
            desription: "lorem",
            thumbnail: "https://th.bing.com/th/id/OIP.oTAts-vs68T4vch6Q0smQwHaFe?pid=ImgDet&rs=1",
            code: "sas22",
            status: true
        },
        {
            title: "example3",
            price: 12,
            stock: 4,
            desription: "lorem",
            thumbnail: "https://th.bing.com/th/id/OIP.oTAts-vs68T4vch6Q0smQwHaFe?pid=ImgDet&rs=1",
            code: "sas22",
            status: true
        },
        {
            title: "example4",
            price: 12,
            stock: 4,
            desription: "lorem",
            thumbnail: "https://th.bing.com/th/id/OIP.oTAts-vs68T4vch6Q0smQwHaFe?pid=ImgDet&rs=1",
            code: "sas22",
            status: true
        },
        {
            title: "example5",
            price: 12,
            stock: 4,
            desription: `Lorem ipsum dolor, sit amet consectetur adipisicing elit. Dolorem et aut eos perspiciatis, ratione repudiandae
    vitae? Autem, facere pariatur provident dignissimos velit obcaecati modi nisi dolorum officiis delectus ad
    doloremque!`,
            thumbnail: "https://th.bing.com/th/id/OIP.oTAts-vs68T4vch6Q0smQwHaFe?pid=ImgDet&rs=1",
            code: "sas22",
            status: true
        },
        {
            title: "example6",
            price: 12,
            stock: 4,
            desription: `Lorem ipsum dolor, sit amet consectetur adipisicing elit. Dolorem et aut eos perspiciatis, ratione repudiandae
    vitae? Autem, facere pariatur provident dignissimos velit obcaecati modi nisi dolorum officiis delectus ad
    doloremque!`,
            thumbnail: "https://th.bing.com/th/id/OIP.oTAts-vs68T4vch6Q0smQwHaFe?pid=ImgDet&rs=1",
            code: "sas22",
            status: true
        },
        {
            title: "example7",
            price: 12,
            stock: 4,
            desription: `Lorem ipsum dolor, sit amet consectetur adipisicing elit. Dolorem et aut eos perspiciatis, ratione repudiandae
    vitae? Autem, facere pariatur provident dignissimos velit obcaecati modi nisi dolorum officiis delectus ad
    doloremque!`,
            thumbnail: "https://th.bing.com/th/id/OIP.oTAts-vs68T4vch6Q0smQwHaFe?pid=ImgDet&rs=1",
            code: "sas22",
            status: true
        },
        {
            title: "example8",
            price: 12,
            stock: 4,
            desription: `Lorem ipsum dolor, sit amet consectetur adipisicing elit. Dolorem et aut eos perspiciatis, ratione repudiandae
    vitae? Autem, facere pariatur provident dignissimos velit obcaecati modi nisi dolorum officiis delectus ad
    doloremque!`,
            thumbnail: "https://th.bing.com/th/id/OIP.oTAts-vs68T4vch6Q0smQwHaFe?pid=ImgDet&rs=1",
            code: "sas22",
            status: true
        },
        {
            title: "example9",
            price: 12,
            stock: 4,
            desription: `Lorem ipsum dolor, sit amet consectetur adipisicing elit. Dolorem et aut eos perspiciatis, ratione repudiandae
    vitae? Autem, facere pariatur provident dignissimos velit obcaecati modi nisi dolorum officiis delectus ad
    doloremque!`,
            thumbnail: "https://th.bing.com/th/id/OIP.oTAts-vs68T4vch6Q0smQwHaFe?pid=ImgDet&rs=1",
            code: "sas22",
            status: true
        },
        {
            title: "example01",
            price: 12,
            stock: 4,
            desription: `Lorem ipsum dolor, sit amet consectetur adipisicing elit. Dolorem et aut eos perspiciatis, ratione repudiandae
    vitae? Autem, facere pariatur provident dignissimos velit obcaecati modi nisi dolorum officiis delectus ad
    doloremque!`,
            thumbnail: "https://th.bing.com/th/id/OIP.oTAts-vs68T4vch6Q0smQwHaFe?pid=ImgDet&rs=1",
            code: "sas22",
            status: true
        },
        {
            title: "example21",
            price: 12,
            stock: 4,
            desription: `Lorem ipsum dolor, sit amet consectetur adipisicing elit. Dolorem et aut eos perspiciatis, ratione repudiandae
    vitae? Autem, facere pariatur provident dignissimos velit obcaecati modi nisi dolorum officiis delectus ad
    doloremque!`,
            thumbnail: "https://th.bing.com/th/id/OIP.oTAts-vs68T4vch6Q0smQwHaFe?pid=ImgDet&rs=1",
            code: "sas22",
            status: true
        },
        {
            title: "example12",
            price: 12,
            stock: 4,
            desription: `Lorem ipsum dolor, sit amet consectetur adipisicing elit. Dolorem et aut eos perspiciatis, ratione repudiandae
    vitae? Autem, facere pariatur provident dignissimos velit obcaecati modi nisi dolorum officiis delectus ad
    doloremque!`,
            thumbnail: "https://th.bing.com/th/id/OIP.oTAts-vs68T4vch6Q0smQwHaFe?pid=ImgDet&rs=1",
            code: "sas22",
            status: true
        },
        {
            title: "example13",
            price: 12,
            stock: 4,
            desription: `Lorem ipsum dolor, sit amet consectetur adipisicing elit. Dolorem et aut eos perspiciatis, ratione repudiandae
    vitae? Autem, facere pariatur provident dignissimos velit obcaecati modi nisi dolorum officiis delectus ad
    doloremque!`,
            thumbnail: "https://th.bing.com/th/id/OIP.oTAts-vs68T4vch6Q0smQwHaFe?pid=ImgDet&rs=1",
            code: "sas22",
            status: true
        },
        {
            title: "example123",
            price: 12,
            stock: 4,
            desription: `Lorem ipsum dolor, sit amet consectetur adipisicing elit. Dolorem et aut eos perspiciatis, ratione repudiandae
    vitae? Autem, facere pariatur provident dignissimos velit obcaecati modi nisi dolorum officiis delectus ad
    doloremque!`,
            thumbnail: "https://th.bing.com/th/id/OIP.oTAts-vs68T4vch6Q0smQwHaFe?pid=ImgDet&rs=1",
            code: "sas22",
            status: true
        },
        {
            title: "example321",
            price: 12,
            stock: 4,
            desription: `Lorem ipsum dolor, sit amet consectetur adipisicing elit. Dolorem et aut eos perspiciatis, ratione repudiandae
    vitae? Autem, facere pariatur provident dignissimos velit obcaecati modi nisi dolorum officiis delectus ad
    doloremque!`,
            thumbnail: "https://th.bing.com/th/id/OIP.oTAts-vs68T4vch6Q0smQwHaFe?pid=ImgDet&rs=1",
            code: "sas22",
            status: true
        },
        {
            title: "example3",
            price: 12,
            stock: 4,
            desription: `Lorem ipsum dolor, sit amet consectetur adipisicing elit. Dolorem et aut eos perspiciatis, ratione repudiandae
    vitae? Autem, facere pariatur provident dignissimos velit obcaecati modi nisi dolorum officiis delectus ad
    doloremque!`,
            thumbnail: "https://www.marketingdirecto.com/wp-content/uploads/2015/12/productos-cool.jpg",
            code: "sas22",
            status: true
        },
        {
            title: "example43",
            price: 12,
            stock: 4,
            desription: `Lorem ipsum dolor, sit amet consectetur adipisicing elit. Dolorem et aut eos perspiciatis, ratione repudiandae
    vitae? Autem, facere pariatur provident dignissimos velit obcaecati modi nisi dolorum officiis delectus ad
    doloremque!`,
            thumbnail: "https://th.bing.com/th/id/OIP.oTAts-vs68T4vch6Q0smQwHaFe?pid=ImgDet&rs=1",
            code: "sas22",
            status: true
        },
        {
            title: "example345",
            price: 12,
            stock: 4,
            desription: `Lorem ipsum dolor, sit amet consectetur adipisicing elit. Dolorem et aut eos perspiciatis, ratione repudiandae
    vitae? Autem, facere pariatur provident dignissimos velit obcaecati modi nisi dolorum officiis delectus ad
    doloremque!`,
            thumbnail: "https://th.bing.com/th/id/OIP.oTAts-vs68T4vch6Q0smQwHaFe?pid=ImgDet&rs=1",
            code: "sas22",
            status: true
        },
        {
            title: "Final",
            price: 12,
            stock: 4,
            desription: `Lorem ipsum dolor, sit amet consectetur adipisicing elit. Dolorem et aut eos perspiciatis, ratione repudiandae
    vitae? Autem, facere pariatur provident dignissimos velit obcaecati modi nisi dolorum officiis delectus ad
    doloremque!`,
            thumbnail: "https://th.bing.com/th/id/OIP.oTAts-vs68T4vch6Q0smQwHaFe?pid=ImgDet&rs=1",
            code: "sas22",
            status: true
        },
    ]

let HTML = "<h3>Not found</h3>";
optionsContent.addEventListener("click", e => {
    const target = e.target;

    const existRequest = target.closest("div").querySelector(".handleRequest");
    if (!target.hasAttribute("data-text")) return;

    else if (!!existRequest) {
        return existRequest.parentNode.removeChild(existRequest);
    }

    switch (target.getAttribute("id")) {
        case "getProducts":
            handleProduct(orders, "create");
            break;
        case "getUpdatedProducts":
            handleProduct(orders, "update");
            break;
        case "getDeletedProducts":
            handleProduct(orders, "delete");
            break;
        case "getAdmins":
            return location.href = "/crud-admin&getAdmins";
        case "getOrder":
            onHandleOrder(orders);
            break;
        case "settings":
            handleUserSettings();
    }

    changeBody.style.backgroundColor = "var(--options-color)";

    target.parentNode.innerHTML += `
    <div class="handleRequest">
    <span class="goBack" onclick="handleGoBack()">&#8592;</span>
        ${HTML}
        </div>
        `;

    if ("onChangeFunction" in helper) helper.onChangeFunction();

    const handleRequest = document.querySelector(".handleRequest");

    const onScrollProduct = !!HTML ? [...handleRequest.children].find(element =>
        element.tagName === "DIV").getBoundingClientRect() : handleRequest.getBoundingClientRect();

    console.log(onScrollProduct);

    window.scrollTo({
        top: onScrollProduct.y,
        left: onScrollProduct.x,
        behavior: "smooth"
    });

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

const handleLogout = () => location.href = "/user/logout";