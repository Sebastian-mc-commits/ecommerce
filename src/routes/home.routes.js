import { Router } from "express";
import * as HomeController from "../controllers/home.controller.js";
import expressAsyncHandler from "express-async-handler";
const router = Router();

router.get(
  "/getProductsAndPagination",
  expressAsyncHandler(HomeController.initHome)
);
// router.get("/", HomeController.initHome);

router.get(
  "/getProductById/:pid",
  expressAsyncHandler(HomeController.getProductById)
);

router.get(
  "/getAvailableCategories",
  expressAsyncHandler(HomeController.availableCategories)
);

router.get("/getMaxPrice", expressAsyncHandler(HomeController.getPrice));

router.get(
  "/getRandomProducts",
  expressAsyncHandler(HomeController.getRandomProducts)
);

router.get(
  "/clearProductCookies",
  expressAsyncHandler(HomeController.clearProductCookies)
);

export default router;
