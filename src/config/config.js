import { config as dotenvConfig } from "dotenv";
import program from "../utils/commander.utils.js";
import buildFrontEndUrl from "../utils/functions/frontEndParser.utils.js";

const { fakerRecords, mode = "developing", port } = program.opts();

dotenvConfig({
  path: mode === "production" ? "./.env.production" : "./.env.dev"
});

const {
  MONGO_URI,
  PORT,
  SESSION_SECRET,
  SECRET_COOKIE,
  SECRET_JWT,
  APP_ID,
  CLIENT_ID,
  CLIENT_SECRET,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  LOCALHOST_CORS,
  MYSQL_NAME,
  MYSQL_PASSWORD,
  MYSQL_USERNAME,
  MYSQL_HOST,
  STORE
} = process.env;

const FRONT_END_VIEWS = {
  AUTH_PAGE: buildFrontEndUrl({
    url: [LOCALHOST_CORS, "auth"]
  })
};

const config = {
  MONGO_URI,
  PORT: port || PORT,
  SESSION_SECRET,
  SECRET_COOKIE,
  SECRET_JWT,
  APP_ID,
  CLIENT_ID,
  CLIENT_SECRET,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  fakerRecords,
  LOCALHOST_CORS,
  FRONT_END_VIEWS,
  MYSQL: {
    MYSQL_HOST,
    MYSQL_NAME,
    MYSQL_PASSWORD,
    MYSQL_USERNAME
  },
  DATABASE_OPS: {
    PAGINATE: 15,
    STORE
  }
};

export default config;
