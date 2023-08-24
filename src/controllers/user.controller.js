import * as UserService from "../services/user.service.js";
import userMessages from "../utils/messages/messages.user.utils.js";

export const getCurrentUser = (req, res) => {
  const selectedUser = req.session.user;
  res.json(selectedUser);
};

export const getUserById = async (req, res) => {
  const { id } = req.query;
  const selectedUser = await UserService.getUserById(id);
  res.json(selectedUser);
};

export const setUserToAdmin = async (req, res) => {
  const adminId = req.session.user._id;
  const user = await UserService.userToAdmin(adminId, req.params.id);
  // res.redirect("/crud-admin");
  res.json({ message: userMessages.ADMIN_UPDATE(user.name), user });
};

export const unsetUserToAdmin = async (req, res) => {
  const adminId = req.session.user._id;
  const user = await UserService.unsetUserToAdmin(adminId, req.params.id);
  // res.redirect("/crud-admin");
  res.json({ message: userMessages.UNSET_ADMIN(user.name), user });
};

export const getAdmins = async (req, res) => {
  const admins = await UserService.getAdmins();

  res.json(admins);
};

export const getUsers = async (req, res) => {
  const { skip = 0 } = req?.query || {};
  const users = await UserService.getUsers(parseInt(skip));
  res.json(users);
};
