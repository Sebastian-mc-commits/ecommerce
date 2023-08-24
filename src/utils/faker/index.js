import config from "../../config/config";

const {STORE} = config

switch (STORE) {
  case "mysql": {
    import "./faker.mysql.cmp.js"
  }

  case "mongodb": {
    import "./faker.cmp.utils.js"
  }
}