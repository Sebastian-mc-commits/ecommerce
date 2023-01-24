import { Router } from "express";
import * as comments from "../services/comment.service.js";

const router = Router();

router.get("/:id", async (req, res) => {
    try {
        const {id} = req.params;
        // const comments = await getComments(id);
        const getComments = await comments.getComments(id);
        res.render("listContent", { getProduct: getComments });
    }
    catch (err) {
        req.flash("message", { message: "Product Not Found", type: "warning", error: err.message });
        return res.status(404).render("errorHandler");
    }
})
export default router;