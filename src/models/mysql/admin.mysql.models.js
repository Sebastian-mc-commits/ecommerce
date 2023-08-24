import { DataTypes } from "sequelize";
import sequelize from "../../config/mysqlDB/db.config.js";
import { roleEnum } from "../../utils/enums/roles.enum.js";

const { STRING, UUID, UUIDV4 } = DataTypes;

const AdminModel = sequelize.define("admins", {
  id: {
    primaryKey: true,
    type: UUID,
    defaultValue: UUIDV4,
    allowNull: false
  },

  admin: {
    type: UUID,
    allowNull: false
  },

  adminType: {
    type: STRING,
    allowNull: false,
    defaultValue: roleEnum.ADMIN
  }
});

export default AdminModel;
