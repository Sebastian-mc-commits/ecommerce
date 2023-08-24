import { DataTypes } from "sequelize";
import sequelize from "../../../config/mysqlDB/db.config.js";

const { UUID, UUIDV4 } = DataTypes;

const UsersSetToAdminModel = sequelize.define("usersSetToAdmins", {
  adminId: {
    primaryKey: true,
    allowNull: false,
    type: UUID,
    defaultValue: UUIDV4,
    references: {
      model: "users",
      key: "id"
    }
  },

  userSetToAdmin: {
    primaryKey: true,
    allowNull: false,
    type: UUID,
    defaultValue: UUIDV4,
    references: {
      model: "users",
      key: "id"
    }
  }
});

export default UsersSetToAdminModel;
