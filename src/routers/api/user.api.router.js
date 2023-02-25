import { Router } from "express";
import * as UserService from "../../services/user.service.js";
import * as MessageService from "../../services/messages.service.js";

const router = Router();

router.route("/options").get(async (req, res) => {

    // const onlyFront = req.get("Authentication");

    // if (onlyFront !== "123456") return res.status(401);
    try {
        const { id } = req.query;
        const { _id } = req.session.user;
        const [messages] = await MessageService.getMessagesOfUser(_id);
        console.log("messages");
        console.log(messages);
        res.json(messages);
    }
    catch (err) {
        console.log("Error");
        res.json({ data: err.message });
        // res.status(500);
    }
}).post(async (req, res) => {
    const body = req.body;
    const { _id } = req.session.user;
    try {
        const response = await MessageService.createMessage({ from: _id, ...body });
        res.json(response);
    }
    catch (err) {
        res.json({ data: "hi", err: err.message });
        // res.status(500);
    }
});

export default router;