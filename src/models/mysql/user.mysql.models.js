import { DataTypes, Op } from "sequelize";
import sequelize from "../../config/mysqlDB/db.config.js";
import providers, { providerEnum } from "../../utils/enums/provider.enum.js";
import authMessages from "../../utils/messages/messages.auth.utils.js";
import errorCodes from "../../utils/enums/errorCodes.enum.js";
import customErrorCodes from "../../utils/enums/errorCodes.custom.enum.js";
import bcrypt from "bcryptjs";
import ErrorHandler from "../../utils/classes/errorHandler.utils.js";
import serverMessages from "../../utils/messages/messages.server.utils.js";
import AdminModel from "./admin.mysql.models.js";
import userMessages from "../../utils/messages/messages.user.utils.js";
import { roleEnum } from "../../utils/enums/roles.enum.js";
import UsersSetToAdminModel from "./adminOptions/usersSetToAdmin.mysql.js";

const { STRING, ENUM, UUIDV4, UUID } = DataTypes;

const UserModel = sequelize.define("users", {
  id: {
    primaryKey: true,
    type: UUID,
    defaultValue: UUIDV4,
    allowNull: false
  },

  image: {
    type: STRING,
    allowNull: false,
    defaultValue:
      "https://th.bing.com/th/id/R.6c6bff6f40d420c8a756db79a369681c?rik=suTO6OOqRmSAJQ&pid=ImgRaw&r=0"
  },

  name: {
    type: STRING,
    allowNull: false
  },

  last_name: {
    type: STRING,
    allowNull: true
  },

  location: {
    type: UUID,
    allowNull: true
  },

  email: {
    type: STRING,
    unique: true,
    allowNull: false
  },

  password: {
    type: STRING,
    allowNull: true
  },

  provider: {
    type: ENUM,
    values: providers
  }
});

UserModel.beforeCreate(async (user) => {
  if (!user.password && providerEnum.EMAIL_PASSWORD_AUTH) {
    throw new ErrorHandler(
      authMessages.FAIL_PASSWORD,
      "",
      errorCodes.UNAUTHORIZED,
      customErrorCodes.INVALID_REQUEST
    );
  }
  user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10));
});

UserModel.toggleUserAdminStatus = async function ({
  superAdminId,
  userId,
  isSetAdmin
}) {
  try {
    const isAuthorized = await AdminModel.findOne({
      where: {
        admin: superAdminId
      }
    });

    const isUserAnAdmin = await AdminModel.findOne({
      where: {
        admin: userId
      }
    });

    if (isSetAdmin && isUserAnAdmin) {
      throw new ErrorHandler(
        userMessages.ALREADY_AN_ADMIN_UPDATE,
        "",
        errorCodes.DUPLICATE_FIELD,
        customErrorCodes.INVALID_REQUEST
      );
    } else if (
      !isAuthorized ||
      isAuthorized.adminType !== roleEnum.SUPER_ADMIN
    ) {
      throw new ErrorHandler(
        userMessages.ADMIN_ONLY,
        "",
        errorCodes.FORBIDDEN,
        customErrorCodes.INVALID_REQUEST
      );
    }

    await Promise.all([
      isSetAdmin
        ? AdminModel.create({
            admin: userId,
            adminType: roleEnum.ADMIN
          })
        : AdminModel.destroy({
            where: {
              [Op.and]: [
                {
                  admin: userId
                },

                {
                  adminType: roleEnum.ADMIN
                }
              ]
            }
          }),

      isSetAdmin
        ? UsersSetToAdminModel.create({
            adminId: superAdminId,
            userSetToAdmin: userId
          })
        : UsersSetToAdminModel.destroy({
            where: {
              [Op.and]: [
                {
                  adminId: superAdminId
                },
                {
                  userSetToAdmin: userId
                }
              ]
            }
          })
    ]);
  } catch (err) {
    throw new ErrorHandler(
      serverMessages.SERVER_FAILURE,
      err.message,
      errorCodes.INTERNAL_SERVER_ERROR,
      customErrorCodes.DATABASE_ERROR
    );
  }
};
export default UserModel;
