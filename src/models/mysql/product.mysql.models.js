import { DataTypes } from "sequelize";
import sequelize from "../../config/mysqlDB/db.config.js";
import ErrorHandler from "../../utils/classes/errorHandler.utils.js";
import productMessages from "../../utils/messages/messages.product.utils.js";
import errorCodes from "../../utils/enums/errorCodes.enum.js";
import customErrorCodes from "../../utils/enums/errorCodes.custom.enum.js";
import AdminModel from "./admin.mysql.models.js";
import userMessages from "../../utils/messages/messages.user.utils.js";
import serverMessages from "../../utils/messages/messages.server.utils.js";
import DeletedProductsModel from "./adminOptions/deletedProducts.mysql.models.js";
import tryCatchHandler from "../../utils/functions/tryCatch.utils.js";
// import {paginate} from "sequelize-paginate"

const { INTEGER, BOOLEAN, STRING, TIME, UUID, UUIDV4, DOUBLE } = DataTypes;
const ProductModel = sequelize.define("products", {
  id: {
    type: UUID,
    primaryKey: true,
    defaultValue: UUIDV4,
    allowNull: false
  },

  title: {
    type: STRING,
    allowNull: false
  },

  description: {
    type: STRING,
    allowNull: false
  },

  price: {
    type: DOUBLE,
    allowNull: false
  },

  thumbnail: {
    type: STRING,
    allowNull: false,
    defaultValue:
      "https://i.pinimg.com/originals/73/a6/c4/73a6c4e772e4aad4e6ec37de2f52af74.png"
  },

  code: {
    type: INTEGER,
    allowNull: false,
    unique: true,
    validate: {
      checkForDuplicateCode: async (codeValue) => {
        if (
          await ProductModel.findOne({
            where: {
              code: codeValue
            }
          })
        ) {
          throw new ErrorHandler(
            productMessages.DUPLICATE_ENTRY,
            "",
            errorCodes.BAD_REQUEST,
            customErrorCodes.INVALID_REQUEST
          );
        }
      }
    }
  },

  stock: {
    type: INTEGER,
    allowNull: false,
    validate: {
      notNegative: (value) => {
        if (value < 0) {
          throw new ErrorHandler(
            productMessages.FIELD_ERROR,
            "",
            errorCodes.BAD_REQUEST,
            customErrorCodes.INVALID_REQUEST
          );
        }
      }
    }
  },

  status: {
    type: BOOLEAN,
    allowNull: false,
    defaultValue: true
  },

  createdBy: {
    type: UUID,
    defaultValue: UUIDV4,
    allowNull: false
  },

  categoryType: {
    type: STRING,
    allowNull: false
  },

  isDeleted: {
    type: BOOLEAN,
    allowNull: false,
    defaultValue: false
  },

  deletedAt: {
    type: TIME,
    allowNull: true
  }
});

// paginate(ProductModel);

const handleBeforeEvents = async (model) => {
  tryCatchHandler({
    fn: async () => {
      const isAuthorizedForCreate = await AdminModel.findOne({
        where: {
          admin: model.createdBy
        }
      });

      console.log(isAuthorizedForCreate);
      if (!isAuthorizedForCreate) {
        throw new ErrorHandler(
          userMessages.ADMIN_ONLY,
          "",
          errorCodes.FORBIDDEN,
          customErrorCodes.INVALID_REQUEST
        );
      }
    }
  });
};

ProductModel.beforeCreate(handleBeforeEvents);
ProductModel.beforeDestroy(handleBeforeEvents);

ProductModel.prototype.irreversibleDeleteProduct = async function (adminId) {
  const transaction = await sequelize.transaction();
  try {
    await Promise.all([
      DeletedProductsModel.destroy(
        {
          where: {
            adminId,
            productDeleted: this.id
          }
        },
        {
          transaction
        }
      ),
      ProductModel.destroy(
        {
          where: {
            id: this.id,
            isDeleted: true
          }
        },
        {
          transaction
        }
      )
    ]);

    await transaction.commit();
  } catch (err) {
    transaction.rollback();
    throw new ErrorHandler(
      serverMessages.SERVER_FAILURE,
      err.message,
      errorCodes.FORBIDDEN,
      customErrorCodes.INVALID_REQUEST
    );
  }
};

ProductModel.prototype.handleDelete = async function (adminId) {
  const transaction = await sequelize.transaction();
  try {
    await Promise.all([
      DeletedProductsModel.create(
        {
          adminId,
          productDeleted: this.id
        },
        {
          transaction
        }
      ),

      ProductModel.update(
        {
          isDeleted: true,
          deletedAt: new Date().getTime()
        },
        {
          where: {
            id: this.id
          },
          transaction
        }
      )
    ]);

    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw new ErrorHandler(
      userMessages.ADMIN_ONLY,
      "",
      errorCodes.FORBIDDEN,
      customErrorCodes.INVALID_REQUEST
    );
  }
};

ProductModel.prototype.restoreDeletedProduct = async function (adminId) {
  const transaction = await sequelize.transaction();

  try {
    await Promise.all([
      DeletedProductsModel.destroy(
        {
          where: {
            adminId,
            productDeleted: this.id
          }
        },
        {
          transaction
        }
      ),

      ProductModel.update(
        {
          isDeleted: false
        },
        {
          where: {
            id: this.id,
            isDeleted: true
          },
          transaction
        }
      )
    ]);

    await transaction.commit();
  } catch (err) {
    await transaction.rollback();
    throw new ErrorHandler(
      serverMessages.SERVER_FAILURE,
      err.message,
      errorCodes.FORBIDDEN,
      customErrorCodes.INVALID_REQUEST
    );
  }
};
export default ProductModel;
