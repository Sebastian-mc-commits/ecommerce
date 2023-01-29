import { Router } from "express";
import * as comments from "../services/comment.service.js";

const router = Router();

router.get("/:id", async (req, res) => {
    try {
        const {id} = req.params;
        const getComments = await comments.getComments(id);
        console.log(getComments);
        res.render("listContent", { getProduct: getComments });
    }
    catch (err) {
        req.flash("message", { message: "Product Not Found", type: "warning", error: err.message });
        console.log(err);
        return res.status(404).render("errorHandler");
    }
})

export default router;