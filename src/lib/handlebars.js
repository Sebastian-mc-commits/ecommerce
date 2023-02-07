// import { cart } from "../classes/index.js"
import Handlebars from "handlebars"
import { countProductsOfCart } from "../services/cart.service.js";

const helpers = {}

helpers.length = async (id) => {
    console.log(id);
    const count = await countProductsOfCart(id);
    return count || "void";
};

helpers.currentView = (options) => options.data.exphbs.view;

helpers.showMenu = (options) => !/crud-admin/g.test(helpers.currentView(options));

Handlebars.registerHelper("isEqual", (value1, value2, options) => {
    if (value1 === value2) {
        return options.fn(this);
    }
    return options.inverse(this);
});

// Handlebars.compile(fs.readFileSync("./template.hbs", "utf8"))({});

export default helpers;