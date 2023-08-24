import * as CartService from "../services/cart.service.js";

export const getProductsFromCart = async () => {
  const userId = req.session.user._id;
  const products = await CartService.getProductsFromCart(userId);
  res.json(products);
};
export const addToCart = async () => {
  const { id } = req.params;
  const userId = req.session.user._id;
  const product = await CartService.addToCart(userId, id);
  res.json(product);
};
export const deleteItemToCart = async () => {
  const { pid } = req.params;
  const userId = req.session.user._id;
  await CartService.deleteFromUserToCart(userId, pid);
  res.sendStatus(200);
};
export const deleTeAllItemsFromCart = async () => {
  const userId = req.session.user._id;
  await CartService.deleteAll(userId);
  res.sendStatus(200);
};
