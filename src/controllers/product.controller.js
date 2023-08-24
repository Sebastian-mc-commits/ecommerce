import productMessages from "../utils/messages/messages.product.utils.js";
// import * as ProductService from "../services/product.service.js";
import Factory from "../services/factory.js";
const { product: ProductService } = Factory;

export const deleteProduct = async (req, res) => {
  const { pid = "" } = req?.query || {};
  const { _id: userId } = req?.session?.user || {};
  // const headerAuthentication = req.get("Authorization");

  const product = await ProductService.deleteProduct(userId, pid);
  res.json({
    product,
    message: productMessages.DELETED_PRODUCT(product.title)
  });
};

export const addProduct = async (req, res) => {
  const file = req.file?.filename;
  const { title, price, code, status, stock, description, categoryType } =
    req.body;

  const data = {
    title,
    price: parseInt(price),
    code,
    status: status == true,
    stock: parseInt(stock),
    description,
    categoryType
  };

  if (file) data.thumbnail = `/public/uploads/images/${file}`;

  const createdBy = req.session?.user?._id;

  const product = await ProductService.createProduct(createdBy, data);
  res.json({ product, message: productMessages.ADDED_PRODUCT(product.title) });
};

export const updateProduct = async (req, res) => {
  const { title, price, code, status, stock, description } = req.body;

  const data = {
    title,
    price: parseInt(price),
    code,
    status: status == true,
    stock: parseInt(stock),
    description
  };

  const { pid = "" } = req.params || {};
  const product = await ProductService.updateProduct(pid, data);
  res.json({
    product,
    message: productMessages.UPDATED_PRODUCT(product.title)
  });
};

export const getDeletedProducts = async (req, res) => {
  const { _id = "" } = req.session?.user || {};
  const { skip = 0 } = req.query;
  const products = await ProductService.getDeletedProducts(_id, +skip);

  res.json(products);
};

export const irreversibleDelete = async (req, res) => {
  const { _id: userId = "" } = req.session?.user || {};
  const { _id = "" } = req.params || {};
  const product = await ProductService.irreversibleDelete(userId, _id);

  res.json({
    product,
    message: productMessages.PRODUCT_PERMANENTLY_DELETED(product.title)
  });
};

export const restoreDeletedProduct = async (req, res) => {
  const { _id: userId = "" } = req.session?.user || {};
  const { _id = "" } = req.params || {};
  const product = await ProductService.restoreDeletedProduct(userId, _id);

  res.json({
    product,
    message: productMessages.PRODUCT_RESTORED(product.title)
  });
};

export const getCreatedProductsByAdmin = async (req, res) => {
  const { _id = "" } = req.session?.user || {};
  const { skip = 0 } = req.query;
  const products = await ProductService.getCreatedProductsByAdmin(_id, +skip);

  res.json(products);
};
