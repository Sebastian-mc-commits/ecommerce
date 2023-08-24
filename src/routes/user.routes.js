import { Router } from "express";
import {
  authenticate,
  authenticateSuperAdmin
} from "../lib/middleware/authentication.js";
import * as UserController from "../controllers/user.controller.js";
import { verifyTokenSuperAdmin } from "../lib/middleware/verifyToken.middleware.js";
import asyncHandler from "express-async-handler";
import expressAsyncHandler from "express-async-handler";
const router = Router();

router.get("/getCurrentUser", authenticate, UserController.getCurrentUser);

// router.get("/getUserById", authenticateSuperAdmin, UserController.getUserById);
router.get("/getUserById", asyncHandler(UserController.getUserById));

router.put(
  "/setUserToAdmin/:id",
  authenticateSuperAdmin,
  verifyTokenSuperAdmin,
  expressAsyncHandler(UserController.setUserToAdmin)
);

router.put(
  "/unsetToAdmin/:id",
  authenticateSuperAdmin,
  verifyTokenSuperAdmin,
  expressAsyncHandler(UserController.unsetUserToAdmin)
);

router.get(
  "/getAdmins",
  authenticate,
  verifyTokenSuperAdmin,
  expressAsyncHandler(UserController.getAdmins)
);

router.get(
  "/getUsers",
  authenticateSuperAdmin,
  verifyTokenSuperAdmin,
  expressAsyncHandler(UserController.getUsers)
);

// router.route("/options").get(async (req, res) => {
//
//   // const onlyFront = req.get("Authentication");
//
//   // if (onlyFront !== "123456") return res.status(401);
//   try {
//       const { _id } = req.session.user;
//       const [messages] = await MessageService.getMessagesOfUser(_id);
//       res.json(messages);
//   }
//   catch (err) {
//       res.json({ data: err.message });
//       // res.status(500);
//   }
// }).post(async (req, res) => {
//   const body = req.body;
//   const { _id } = req.session.user;
//   try {
//       const response = await MessageService.createMessage({ from: _id, ...body });
//       res.json(response);
//   }
//   catch (err) {
//       res.json({ data: "hi", err: err.message });
//       // res.status(500);
//   }
// });
//
export default router;
