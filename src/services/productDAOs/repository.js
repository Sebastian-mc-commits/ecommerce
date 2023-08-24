import ProductDTO from "./DTO.js";

export default class ProductRepository {
  #productDAO;
  constructor(productDAO) {
    this.#productDAO = productDAO;
  }

  getProducts(page) {
    const products = this.#productDAO.getProducts(page);
    return new ProductDTO(products);
  }

  getAllProducts(skip = 10) {
    const products = this.#productDAO.getAllProducts(skip);
    return new ProductDTO(products);
  }

  handleApplyFilters(filters) {
    const products = this.#productDAO.handleApplyFilters(filters);
    return new ProductDTO(products);
  }

  getDeletedProducts(userId, skip = 0) {
    const products = this.#productDAO.getDeletedProducts(userId, skip);
    return new ProductDTO(products);
  }

  getProduct(_id) {
    const product = this.#productDAO.getProduct(_id);
    return new ProductDTO(product);
  }

  getCreatedProductsByAdmin(_id, skip = 0) {
    const products = this.#productDAO.getCreatedProductsByAdmin(_id, skip);
    return new ProductDTO(products);
  }

  deleteProduct(userId, _id) {
    const product = this.#productDAO.deleteProduct(userId, _id);
    return new ProductDTO(product);
  }

  irreversibleDelete(userId, _id) {
    const product = this.#productDAO.irreversibleDelete(userId, _id);
    return new ProductDTO(product);
  }

  restoreDeletedProduct(userId, _id) {
    const product = this.#productDAO.restoreDeletedProduct(userId, _id);
    return new ProductDTO(product);
  }

  getAvailableCategories() {
    const product = this.#productDAO.getAvailableCategories();
    return new ProductDTO(product);
  }

  getTheHighestPrice() {
    const product = this.#productDAO.getTheHighestPrice();
    return new ProductDTO(product);
  }

  getRandomProduct(fields) {
    const product = this.#productDAO.getProducts(fields);
    return new ProductDTO(product);
  }
}
