import ProductRepository from "./productDAOs/repository.js";

const paths = {
  mysql: "./productDAOs/product.mysql.js"
};

const persistance = "mysql";

switch (persistance) {
  case "mysql": {
  }
}

console.log(paths[persistance]);
const { default: product } = await import(paths[persistance]);
let Factory = {
  product: new ProductRepository(product)
};

export default Factory;
