import AdminModel from "./admin.mysql.models.js";
import DeletedProductsModel from "./adminOptions/deletedProducts.mysql.models.js";
import UsersSetToAdminModel from "./adminOptions/usersSetToAdmin.mysql.js";
import ProductModel from "./product.mysql.models.js";
import UserModel from "./user.mysql.models.js";

//Admin associations
UserModel.hasMany(AdminModel, {
  foreignKey: "admin"
});
AdminModel.belongsTo(UserModel, {
  foreignKey: "admin"
});

//Products associations
UserModel.hasOne(ProductModel, {
  foreignKey: "createdBy"
});

ProductModel.belongsTo(UserModel, {
  foreignKey: "createdBy"
});

//DeletedProducts associations
UserModel.hasMany(DeletedProductsModel, {
  foreignKey: "adminId"
});

DeletedProductsModel.belongsTo(UserModel, {
  foreignKey: "adminId"
});

ProductModel.hasOne(DeletedProductsModel, {
  foreignKey: "productDeleted"
});

DeletedProductsModel.belongsTo(ProductModel, {
  foreignKey: "productDeleted"
});

//UsersSetToAdmin associations
UserModel.hasMany(UsersSetToAdminModel, {
  foreignKey: "adminId"
});

UsersSetToAdminModel.belongsTo(UserModel, {
  foreignKey: "adminId"
});

UserModel.hasMany(UsersSetToAdminModel, {
  foreignKey: "userSetToAdmin"
});

UsersSetToAdminModel.belongsTo(UserModel, {
  foreignKey: "userSetToAdmin"
});

export {
  UserModel,
  ProductModel,
  AdminModel,
  DeletedProductsModel,
  UsersSetToAdminModel
};
