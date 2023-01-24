import { Router } from "express";
import { extname } from "path";
import { v4 } from "uuid";
import * as product from "../services/product.service.js";
import __dirname from "../__dirname.js";
import multer from "multer";
import { authenticateAdmin } from "../lib/middleware/authentication.js";

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


router.get("/", async (req, res) => {
    try {
        // const {limit} = req.query;
        // const products = await product.getProducts(limit);
        const products = await product.getProducts();
        res.render("home", {
            products
        });
    }
    catch (err) {
        req.flash("message", { message: "Has been a problem with the products render", type: "warning", error: err.message });
        return res.status(500).render("errorHandler");
    }
});

router.get("/crud-admin", async (req, res) => {
    try {
        // res.render("crud-admin", { products: await product.getProducts() });
        res.render("crud-admin");
    }
    catch (err) {
        req.flash("message", { message: "Has been a problem with the Admin page render", type: "warning", error: err.message });
        return res.status(500).render("errorHandler");
    }
});

router.get("/:pid", async (req, res) => {
    const { pid } = req.params;

    try {
        const productId = await product.getProduct(pid);

        res.render("home", { products: productId, getProductById: true });
    }
    catch (err) {
        req.flash("message", { message: "Product Not Found", type: "warning", error: err.message });
        return res.status(404).render("errorHandler");
    }
});

router.get("/delete/:pid", authenticateAdmin, async (req, res) => {
    try {
        const { pid } = req.params;
        await product.deleteProduct(pid);
        res.redirect("/home/crud-admin");
    }
    catch {
        req.flash("message", { message: "Product Not Found", type: "warning", error: err.message });
        return res.status(404).render("errorHandler");
    }
});

router.post("/addProduct", upload.single("thumbnail"), async (req, res) => {
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
        res.redirect("/home/crud-admin");
    }
    catch (err) {
        req.flash("message", { message: "Server error", type: "warning", error: err.message });
        return res.status(500).redirect("/home/crud-admin");
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

        const {pid} = req.params;
        await product.updateProduct(pid, data);
        res.redirect("/home/crud-admin");
    }
    catch {
        return res.status(500).render("errorHandler");
    }
});

router.get("/crud-admin/deleteUser/:id", authenticateAdmin, async (req, res) => {
    try {
        await user.deleteUser(req.params.id);
        res.redirect("/home/crud-admin");
    }
    catch (err) {
        req.flash("message", { message: "Something went wrong try later", type: "warning", error: err.message });
        return res.status(400).redirect("/home/crud-admin");
    }
});

router.get("/crud-admin/setUserToAdmin/:id", authenticateAdmin, async (req, res) => {
    try {
        await user.userToAdmin(req.params.id);
        res.redirect("/home/crud-admin");
    }
    catch (err) {
        req.flash("message", { message: "Something went wrong try later", type: "warning", error: err.message });
        return res.status(400).redirect("/home/crud-admin");
    }
});
export default router;