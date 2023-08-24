import ProductService from "./src/services/productDAOs/product.mysql.js";
import UserService from "./src/services/userDAOs/user.mysql.js";
import { writeFileSync, readFileSync, existsSync } from "fs";

const gatherServicesData = ({ tag, ...data }) => {
  const initialData = {
    users: [],
    products: []
  };
  const serviceFileName = "SERVICE_KEEPER.json";
  const serviceFileData = existsSync(serviceFileName)
    ? JSON.parse(readFileSync(serviceFileName))
    : initialData;

  return writeFileSync(
    serviceFileName,
    JSON.stringify(
      {
        ...serviceFileData,
        [tag]: {
          ...serviceFileData[tag],
          ...data
        }
      },
      null,
      2
    )
  );
};

const initUser = {
  id: "0334a99c-f52e-4751-aa5d-e2a30c2378a0",
  image:
    "https://th.bing.com/th/id/R.6c6bff6f40d420c8a756db79a369681c?rik=suTO6OOqRmSAJQ&pid=ImgRaw&r=0",
  name: "Sebas",
  last_name: "Admin",
  email: "sm9349168@gmail.com",
  password: "$2a$10$xlCTGEbO0FLHOOlbEmxvLOVMP09yb80bhAaa9sgSRj4lfM.1cgqsu"
};

const initCreateUser = {
  name: "Sebas",
  last_name: "Admin",
  auth: {
    email: "sm9349168@gmail.com",
    password: "Terracranck12-"
  }
};

const initProduct = {
  title: "Test Product",
  description: "test product description",
  price: 1.1,
  code: Math.ceil(Math.random() * 10000),
  stock: 106,
  status: true,
  categoryType: "Test category type"
};

const testFunction = async () => {
  const irreversibleDeleteProduct = "127f00e6-b820-4e81-a96b-2a2bcf746ca8";
  const product = await ProductService.getRandomProduct(
    initUser.id,
    irreversibleDeleteProduct
  );
  // const user = await UserService.createUser(initCreateUser);
  gatherServicesData({
    tag: "products",
    restoreDeletedProduct: { ...product }
  });
  return product;
};

testFunction()
  .then((data) => console.log(data))
  .catch((error) =>
    console.log(
      `🌋 Error Found: ${error?.errorCached}\n🚫Error Message: ${error.message}`
    )
  );
