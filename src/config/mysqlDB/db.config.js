import { Sequelize } from "sequelize";
import config from "../config.js";

const { MYSQL_HOST, MYSQL_NAME, MYSQL_PASSWORD, MYSQL_USERNAME } = config.MYSQL;

const sequelize = new Sequelize(MYSQL_NAME, MYSQL_USERNAME, MYSQL_PASSWORD, {
  dialect: "mysql",
  host: MYSQL_HOST,
  define: {
    timestamps: false
  }
});

sequelize
  .sync({ logging: false })
  .then(() => console.log("🦢 Mysql Database connected"))
  .catch((err) => console.log(`An error occurs: ${err.message}`));

export default sequelize;
