// import { cart } from "../classes/index.js"
import { countProductsOfCart } from "../services/cart.service.js";

const helpers = {}

helpers.length = async (id) => {
    console.log(id);
    const count = await countProductsOfCart(id);
    return count || "void";
};

helpers.currentView = (options) => options.data.exphbs.view;

export default helpers;