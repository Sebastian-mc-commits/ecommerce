import { Router } from "express";
import multer from "multer";
import { extname } from "path";
import { v4 } from "uuid";
import __dirname from "../../__dirname.js";
import { authenticate, authenticateAdmin, authenticateSuperAdmin } from "../../lib/middleware/authentication.js";
import * as ProductService from "../../services/product.service.js";
import { getAdmins, unsetUserToAdmin, userToAdmin, getUsers } from "../../services/user.service.js";
import productMessages from "../../utils/messages/messages.product.utils.js";
import userMessages from "../../utils/messages/messages.user.utils.js";


const router = Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, __dirname("public", "uploads", "images")),
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

router.delete("/deleteProduct/", authenticateAdmin, async (req, res) => {
    try {
        const { pid = "" } = req?.query || {};
        const { _id: userId } = req?.session?.user || {}
        // const headerAuthentication = req.get("Authorization");

        const product = await ProductService.deleteProduct(userId, pid);
        return res.json({ product, status: { message: productMessages.DELETED_PRODUCT(product.title), type: "#B30000" } });
    }
    catch (err) {
        return res.status(404).json({ status: { message: err.message, type: "#B30000" } });
    }
});

router.post("/addProduct", authenticateAdmin, upload.single("thumbnail"), async (req, res) => {
    try {
        const file = req.file?.filename;
        const { title, price, code, status, stock, description, categoryType } = req.body;

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
        res.json({ product, status: { message: productMessages.ADDED_PRODUCT(product.title), type: "#28a745" } });

    }
    catch (err) {
        err.message = err.message.split(":")[1];
        return res.status(500).json({ status: { message: err.message, type: "#B30000" } });
    }

});

router.put("/updateProduct/:pid", authenticateAdmin, async (req, res) => {
    try {

        const { title, price, code, status, stock, description } = req.body;

        const data = {
            title,
            price: parseInt(price),
            code,
            status: status == true,
            stock: parseInt(stock),
            description,
        }

        const { pid = "" } = req.params || {};
        const product = await ProductService.updateProduct(pid, data);
        res.json({ product, status: { message: productMessages.UPDATED_PRODUCT(product.title), type: "#28a745" } });
    }
    catch (err) {
        return res.status(500).json({ status: { message: err.message, type: "#B30000" } });
    }
});

router.put("/setUserToAdmin/:id", authenticateSuperAdmin, async (req, res) => {
    try {
        const adminId = req.session.user._id;
        const user = await userToAdmin(adminId, req.params.id);
        // res.redirect("/crud-admin");
        res.json({ message: userMessages.ADMIN_UPDATE(user.name) });
    }
    catch (err) {
        return res.status(400).json({ message: err.message });
    }
});

router.put("/unsetToAdmin/:id", authenticateSuperAdmin, async (req, res) => {
    try {
        const adminId = req.session.user._id;
        const user = await unsetUserToAdmin(adminId, req.params.id);
        // res.redirect("/crud-admin");
        res.json({ message: userMessages.UNSET_ADMIN(user.name) });
    }
    catch (err) {
        return res.status(400).json({ message: err.message });
    }
});

router.get("/getAdmins", authenticate, async (req, res) => {
    try {
        const admins = await getAdmins();

        res.json(admins);
    }
    catch (err) {
        res.status(401).json({ message: err.message });
    }
});

router.get("/getUsers", authenticateSuperAdmin, async (req, res) => {
    try {
        const { skip = 0 } = req?.query || {};
        const users = await getUsers(parseInt(skip));
        res.json(users);
    }
    catch (err) {
        res.json({ message: err.message });
        // res.status(500);
    }
}
)

export default router;