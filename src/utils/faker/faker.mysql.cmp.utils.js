import { faker } from "@faker-js/faker";
import { v4 } from "uuid";
import config from "../../config/config.js";
import { providerEnum } from "../enums/provider.enum.js";
import { RandomPicture } from "random-picture";
import {
  UserModel,
  ProductModel,
  AdminModel
} from "../../models/mysql/index.js";

console.log("Time Started");
let counter = 0;

setInterval(() => {
  counter += 1;
  if (counter % 5 === 0) {
    console.log(`${counter} Seconds passed`);
  }
}, 1000);

(async () => {
  const records = {
    users: [],
    admins: [],
    products: []
  };

  let initialRecords = +config.fakerRecords;

  const getRandomValueProvided = (arr) => {
    const { floor, random } = Math;
    const element = arr[floor(random() * arr.length)];
    if (!element) return getRandomValueProvided(arr);

    return element;
  };

  try {
    while (initialRecords > 0) {
      const userId = v4();

      records.users.push({
        id: userId,
        image: (await RandomPicture()).url,
        name: faker.internet.userName(),
        last_name: faker.company.name(),
        email: faker.internet.email(),
        provider: providerEnum.EMAIL_PASSWORD_AUTH,
        password: faker.internet.password()
      });

      if (faker.datatype.boolean()) {
        records.admins.push({
          admin: userId
        });
      }

      let randomAdmin = records.users.filter(({ id }) =>
        records.admins.some(({ admin }) => admin === id)
      );

      if (randomAdmin.length) {
        randomAdmin = getRandomValueProvided(randomAdmin)?.id;
        if (randomAdmin) {
          records.products.push({
            title: faker.commerce.product(),
            description: faker.commerce.productDescription(),
            price: faker.commerce.price(),
            thumbnail: (await RandomPicture()).url,
            code: faker.address.zipCode(),
            stock: faker.datatype.number(),
            status: faker.datatype.boolean(),
            createdBy: randomAdmin,
            categoryType: faker.commerce.productAdjective()
          });
        }
      }

      initialRecords--;
    }

    const { admins, users, products } = records;

    await Promise.all([
      UserModel.bulkCreate(users),
      AdminModel.bulkCreate(admins),
      ProductModel.bulkCreate(products)
    ]);

    console.log("Mysql Records inserted successfully 🦣");
    process.exit(0);
  } catch (error) {
    console.log(`Error Found: ${error.message} ${error?.errorCached}`);
    process.exit(1);
  }
})();
