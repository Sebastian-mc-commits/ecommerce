import { Router } from "express";
import { authenticateAdmin } from "../../lib/middleware/authentication.js";
import * as ProductService from "../../services/product.service.js";
import productMessages from "../../utils/messages/messages.product.utils.js";

const router = Router();

router.get("/getDeletedProducts", authenticateAdmin, async (req, res) => {
    try {
        const { _id = "" } = req.session?.user || {};
        const products = await ProductService.getDeletedProducts(_id);

        res.json(products);
    }
    catch (err) {
        res.status(404).json({ message: err.message });
    }
});

router.delete("/irreversibleDelete/:_id", authenticateAdmin, async (req, res) => {
    try {
        const { _id: userId = "" } = req.session?.user || {};
        const { _id = "" } = req.params || {};
        const product = await ProductService.irreversibleDelete(userId, _id);

        res.json({ product, message: productMessages.PRODUCT_PERMANENTLY_DELETED(product.title) });
    }
    catch (err) {
        res.status(404).json({ message: err.message });
    }
});

router.put("/restoreDeletedProduct/:_id", authenticateAdmin, async (req, res) => {
    try {
        const { _id: userId = "" } = req.session?.user || {};
        const { _id = "" } = req.params || {};
        const product = await ProductService.restoreDeletedProduct(userId, _id);

        res.json({ product, message: productMessages.PRODUCT_RESTORED(product.title) });
    }
    catch (err) {
        res.status(404).json({ message: err.message });
    }
});

router.get("/getCreatedByAdminProducts", authenticateAdmin, async (req, res) => {
    try {
        const { _id = "" } = req.session?.user || {};
        const products = await ProductService.getCreatedByAdminProducts(_id);

        res.json(products);
    }
    catch (err) {
        res.status(404).json({ message: err.message });
    }
});

export default router;