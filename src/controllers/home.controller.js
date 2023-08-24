import * as product from "../services/product.service.js";
import { retrieveProductsViewedByCookie } from "../utils/retrieveProductsViewed.js";

export const initHome = async (req, res) => {
  const { page = 1, ...filters } = req.query;
  const render = {};
  const { products: productsViewed = [] } =
    req.signedCookies?.seenProducts || {};

  if (!!productsViewed.length) render.cookie = true;
  else if ("cookie" in render) delete render.cookie;

  if (Object.values(filters).length) {
    if ("types" in filters) {
      if (typeof filters.types === "string") {
        filters.types = filters.types.replace(/[+]/g, " ").split(",");
      } else if (filters.types?.length) {
        filters.types = filters.types.map((filter) =>
          filter.replace(/[+]/g, " ")
        );
      }
    }

    const filterProducts = await product.handleApplyFilters(filters);
    const { length = 0, content = [] } = filterProducts[0] ?? {};

    return res.json({
      ...render,
      products: content,
      productsLength: length
    });
  }

  const { docs, ...pagination } =
    (await product.getProducts(parseInt(page))) || {};

  res.json({
    ...render,
    products: docs,
    pagination
  });
};

export const getProductById = async (req, res) => {
  const { pid } = req.params;

  const [getProduct] = await product.getProduct(pid);
  const existsCookie = req.signedCookies?.seenProducts;
  retrieveProductsViewedByCookie(
    existsCookie,
    "products",
    "seenProducts",
    res,
    getProduct
  );

  res.json(getProduct);
};

//apis
export const availableCategories = async (req, res) => {
  // const authorization = req.get("Authorization");

  // if (authorization === "123456") {
  // }
  //401
  const categories = await product.getAvailableCategories();
  return res.json({ categories });
};

export const getPrice = async (req, res) => {
  const max = await product.getTheHighestPrice();
  return res.status(200).json({
    maxPrice: max[0].price
  });
};

export const getRandomProducts = async (req, res) => {
  const { products: productsSaved } = req.signedCookies.seenProducts;
  const products = await product.getRandomProduct(productsSaved);

  res.json(products);
};

export const clearProductCookies = async (req, res) => {
  res.clearCookie("seenProducts");
  res.sendStatus(200);
};
