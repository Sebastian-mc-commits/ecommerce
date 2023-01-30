import { Router } from "express";
import { extname } from "path";
import { v4 } from "uuid";
import __dirname from "../__dirname.js";
import multer from "multer";
import { authenticateAdmin } from "../lib/middleware/authentication.js";
import * as product from "../services/product.service.js";
import { userToAdmin } from "../services/user.service.js";

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

router.get("/", authenticateAdmin, async (req, res) => {
    try {
        // res.render("crud-admin", { products: await product.getProducts() });
        const user = req.session?.user;
        res.render("crud-admin", {getUser: JSON.stringify(user)});
    }
    catch (err) {
        req.flash("message", { message: "Has been a problem with the Admin page render", type: "warning", error: err.message });
        return res.status(500).render("errorHandler");
    }
});

router.get("/delete/:pid", authenticateAdmin, async (req, res) => {
    try {
        const { pid } = req.params;
        await product.deleteProduct(pid);
        res.redirect("/crud-admin");
    }
    catch {
        req.flash("message", { message: "Product Not Found", type: "warning", error: err.message });
        return res.status(404).render("errorHandler");
    }
});

router.post("/addProduct", authenticateAdmin, upload.single("thumbnail"), async (req, res) => {
    try {
        const file = req.file?.filename;

        const data = {
            title: req.body.title,
            price: parseInt(req.body.price),
            code: req.body.code,
            status: req.body.status == true,
            stock: parseInt(req.body.stock),
            description: req.body.description,
        };

        if (file) data.thumbnail = `/public/uploads/images/${file}`;

        const createdBy = req.session?.user?._id;

        await product.createProduct(createdBy, data);
        res.redirect("/crud-admin");
    }
    catch (err) {
        req.flash("message", { message: "Server error", type: "warning", error: err.message });
        return res.status(500).redirect("/crud-admin");
    }

});

router.post("/updateProduct/:pid", authenticateAdmin, async (req, res) => {
    try {
        const data = {
            title: req.body.title,
            price: parseInt(req.body.price),
            code: req.body.code,
            status: req.body.status == true,
            stock: parseInt(req.body.stock),
            description: req.body.description,
        };

        const { pid } = req.params;
        await product.updateProduct(pid, data);
        res.redirect("/crud-admin");
    }
    catch {
        return res.status(500).render("errorHandler");
    }
});

router.get("/setUserToAdmin/:id", authenticateAdmin, async (req, res) => {
    try {
        await userToAdmin(req.params.id);
        res.redirect("/crud-admin");
    }
    catch (err) {
        req.flash("message", { message: "Something went wrong try later", type: "warning", error: err.message });
        return res.status(400).redirect("/crud-admin");
    }
});
export default router;


// router.get("/deleteUser/:id", authenticateAdmin, async (req, res) => {
//     try {
//         await user.deleteUser(req.params.id);
//         res.redirect("/home/crud-admin");
//     }
//     catch (err) {
//         req.flash("message", { message: "Something went wrong try later", type: "warning", error: err.message });
//         return res.status(400).redirect("/crud-admin");
//     }
// });