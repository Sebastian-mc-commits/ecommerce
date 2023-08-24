import { DataTypes } from "sequelize";
import sequelize from "../../../config/mysqlDB/db.config.js";

const { UUID, UUIDV4 } = DataTypes;
const DeletedProductsModel = sequelize.define("deletedProducts", {
  adminId: {
    primaryKey: true,
    allowNull: false,
    type: UUID,
    references: {
      model: "users",
      key: "id"
    }
  },

  productDeleted: {
    type: UUID,
    defaultValue: UUIDV4,
    primaryKey: true,
    references: {
      model: "products",
      key: "id"
    }
  }
});

export default DeletedProductsModel;
