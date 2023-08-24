import { Router } from "express";
import multer from "multer";
import { extname } from "path";
import { v4 } from "uuid";
import __dirname from "../__dirname.js";
import { authenticateAdmin } from "../lib/middleware/authentication.js";
import { verifyTokenAdmin } from "../lib/middleware/verifyToken.middleware.js";
import * as ProductController from "../controllers/product.controller.js";
import expressAsyncHandler from "express-async-handler";

const router = Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) =>
    cb(null, __dirname("public", "uploads", "images")),
  filename: (req, file, cb) => cb(null, v4() + extname(file.originalname))
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const fileType = /jpg|jpeg|png|gift/;
    const mimetype = fileType.test(extname(file.originalname));

    if (mimetype) return cb(null, true);

    return cb("Error");
  }
});

router.delete(
  "/deleteProduct",
  authenticateAdmin,
  verifyTokenAdmin,
  expressAsyncHandler(ProductController.deleteProduct)
);

router.post(
  "/addProduct",
  authenticateAdmin,
  verifyTokenAdmin,
  upload.single("thumbnail"),
  expressAsyncHandler(ProductController.addProduct)
);

router.put(
  "/updateProduct/:pid",
  authenticateAdmin,
  verifyTokenAdmin,
  expressAsyncHandler(ProductController.updateProduct)
);

router.get(
  "/getDeletedProducts",
  authenticateAdmin,
  expressAsyncHandler(ProductController.getDeletedProducts)
);

router.delete(
  "/irreversibleDelete/:_id",
  authenticateAdmin,
  expressAsyncHandler(ProductController.irreversibleDelete)
);

router.put(
  "/restoreDeletedProduct/:_id",
  authenticateAdmin,
  expressAsyncHandler(ProductController.restoreDeletedProduct)
);

router.get(
  "/getCreatedProductsByAdmin",
  authenticateAdmin,
  expressAsyncHandler(ProductController.getCreatedProductsByAdmin)
);

export default router;
