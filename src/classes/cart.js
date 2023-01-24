import fs from "fs";
import __dirname from "../__dirname.js";
class Cart {
    #product;
    #path;
    constructor(pt) {
        this.#path = __dirname("data", pt);
        this.#product = fs.existsSync(this.#path) ?
            JSON.parse(fs.readFileSync(this.#path)) : [];
    }

    addProduct(products) {

        const existProduct = this.#existProduct(products.id);

        if (existProduct) {

            for (let i = 0; i < this.#product.length; i++) {
                if (this.#product[i].id === products.id) {
                    this.#product[i].quantity++;
                    break;
                }
            }
            return this.#uploadProduct(), "Quantity increased";
        }
        products.quantity = 1;
        this.#product.push({
            ...products,
        });
        this.#uploadProduct();

        return `Product added successfully`;
    }

    #uploadProduct = () => fs.writeFileSync(this.#path, JSON.stringify(this.#product));

    getProducts = (limit = 0) => {

        if (!limit) return this.#product;

        let productLimit = [];
        for (let i = 0; i < limit; i++) productLimit.push(this.#product[i]);
        return productLimit;

    };

    #existProduct = (id) => Boolean(this.#product.find(p => p.id === id));

    deleteProduct(id) {
        if (!this.#existProduct(id)) return false;

        this.#product = this.#product.filter(p => p.id !== id);
        return this.#uploadProduct(), `${id} Deleted successfully`;
    };

    deleteAll = () => {
        this.#product = []
        return this.#uploadProduct(), "All the products has been deleted successfully";
    }
}

export default new Cart("cart.json");
