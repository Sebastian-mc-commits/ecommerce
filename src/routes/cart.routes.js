// import {product, cart} from "../classes/index.js"
import { Router } from "express";
import { authenticate } from "../lib/middleware/authentication.js";
import * as CartController from "../controllers/cart.controller.js";
import expressAsyncHandler from "express-async-handler";
const router = Router();

router.get(
  "/getProductsFromCart",
  authenticate,
  expressAsyncHandler(CartController.getProductsFromCart)
);

router.get(
  "/addToCart/:id",
  authenticate,
  expressAsyncHandler(CartController.addToCart)
);

router.get(
  "/delete/:pid",
  authenticate,
  expressAsyncHandler(CartController.deleteItemToCart)
);

router.get(
  "/deleteAll",
  authenticate,
  expressAsyncHandler(CartController.deleTeAllItemsFromCart)
);

export default router;
