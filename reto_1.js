class ProductManager {
    static #counter = 1;
    #products;
    constructor(products=[]) {
        this.#products = products;
    }

    addProduct(products) {
        if (this.#products.some(p => p.code === products.code)) {
            return `The product ${products.title} already exist`;
        }

        const validateFileds = Object.keys(products).includes("title" && "description" &&
            "price" && "thumbnail" && "code" && "stock") &&
            Object.values(products).every(p => Boolean(p) || p === 0);

        if (!validateFileds) return `${products.title} has missing fields`;

        this.#products.push({ id: ProductManager.#counter++, ...products });
        return `Product ${products.title} has been added successfully`;
    }

    getProducts = () => this.#products;

    getProductById = (id) => this.#products.find(p => p.id === id) || "Not found";
}
const netboock = {
    title: "Portatil", description: "8gb ram, icore-5",
    price: 2000000, thumbnail: "./", code: "1200s", stock: 6
}

const tv = {
    title: "tv", description: "pantalla hd",
    price: 5000000, thumbnail: "./", code: "1200ps"
} //Has missing fields

const shirt = {
    title: "Camisa", description: "lana",
    price: 20000, thumbnail: "./", code: "12001s", stock: 8
}

const shoes = {
    title: "Zapatos", description: "cuero",
    price: 60000, thumbnail: "./", code: "", stock: 0
} //Has missing fields
const furniture = {
    title: "Muebles", description: "suaves y comodos",
    price: 1000000, thumbnail: "./", code: "12001s", stock: 10
}

const product = new ProductManager();
console.log(product.getProducts()); //[]
console.log(product.addProduct(netboock));
console.log(product.addProduct(tv)); //Has missing fields
console.log(product.addProduct(shirt));
console.log(product.addProduct(shoes)); //Has missing fields
console.log(product.addProduct(furniture));// already exist
console.log(product.getProducts());

console.log(product.getProductById(5));//No found
console.log(product.getProductById(2));