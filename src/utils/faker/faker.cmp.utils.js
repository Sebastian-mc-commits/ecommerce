import { faker } from "@faker-js/faker";
import { RandomPicture } from "random-picture";
import { providerEnum } from "../enums/provider.enum.js";
import UserModel from "../../models/user.models.js";
import ProductModel from "../../models/product.model.js";
import MessageModel from "../../models/messages.model.js";
import CommentModel from "../../models/comment.model.js";
import SuperAdminModel from "../../models/superAdmin.model.js";
import AdminModel from "../../models/admin.model.js";
import config from "../../config/config.js";
import { writeFileSync } from "fs";

import "../../config/db.js";

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
    superAdmins: [],
    products: [],
    messages: [],
    productComments: []
  };

  let initialRecords = config.fakerRecords;

  const insertAdmin = (userId) => {
    // const adminGenerated = faker.database.mongodbObjectId();
    records.admins.push({
      _id: faker.database.mongodbObjectId(),
      admin: userId,

      deletedProducts: [],

      updatedProducts: []
    });

    // return adminGenerated;
  };

  const getRandomValueProvided = (arr) => {
    const { floor, random } = Math;
    const element = arr[floor(random() * arr.length)];
    if (!element) return getRandomValueProvided(arr);

    return element;
  };

  const insertSuperAdmin = (userId) => {
    const superAdminGenerated = faker.database.mongodbObjectId();
    records.superAdmins.push({
      _id: superAdminGenerated,
      superAdmin: userId,

      usersSetToAdmin: []
    });

    return superAdminGenerated;
  };

  const getRandomUsers = (quantityNeeded) => {
    const randomUsers = [];
    for (let i = 0; i < quantityNeeded; i++) {
      const user = getRandomValueProvided(records.users)._id;
      randomUsers.push(user);
    }

    console.log("randomUsers, ready to return");
    console.log(randomUsers);
    return randomUsers;
  };

  try {
    while (initialRecords >= 0) {
      const userId = faker.database.mongodbObjectId();
      // const isAdmin = faker.datatype.boolean();
      // const isSuperAdmin = faker.datatype.boolean();
      records.users.push({
        _id: userId,
        image: (await RandomPicture()).url,
        name: faker.internet.userName(),
        last_name: faker.company.name(),
        auth: {
          email: faker.internet.email(),
          provider: providerEnum.EMAIL_PASSWORD_AUTH,
          password: faker.internet.password()
        },

        //         superAdminOptions: {
        //           isSuperAdmin,
        //           superAdmin: isSuperAdmin ? insertSuperAdmin() : ""
        //         },
        //
        //         adminOptions: {
        //           isAdmin: isSuperAdmin || isAdmin,
        //           admin: isAdmin || isSuperAdmin ? insertAdmin() : ""
        //         },

        cart: [],

        orders: [],

        messages: []
      });

      if (faker.datatype.boolean()) {
        records.admins.push({
          admin: userId
        });
      }

      const randomAdmin = records.users.filter(({ _id }) =>
        records.admins.some(({ admin }) => admin === _id)
      );

      if (randomAdmin.length) {
        records.products.push({
          title: faker.commerce.product(),
          description: faker.commerce.productDescription(),
          price: faker.commerce.price(),
          thumbnail: (await RandomPicture()).url,
          code: faker.address.zipCode(),
          stock: faker.datatype.number(),
          status: faker.datatype.boolean(),
          createdBy: getRandomValueProvided(randomAdmin)._id,
          comments: [],
          categoryType: faker.commerce.productAdjective()
        });

        const productCommentId = faker.database.mongodbObjectId();

        records.productComments.push({
          _id: productCommentId,
          rate: faker.datatype.number({ max: 5 }),
          message: faker.lorem.sentence(),
          userCreator: getRandomValueProvided(records.users)._id
        });

        const randomProduct = getRandomValueProvided(records.products);
        const index = records.products.findIndex(
          ({ code }) => code === randomProduct.code
        );

        records.products[index].comments.push(productCommentId);
      }

      if (records.users.length >= 2) {
        const [user1 = "", user2 = ""] = getRandomUsers(2);
        records.messages.push({
          from: user1,
          to: user2,
          message: faker.lorem.paragraph()
        });

        records.users
          .filter(({ _id }) => _id === user1 || _id === user2)
          .forEach((user) => {
            const currentOnBlockUser = user._id === user1 ? user2 : user1;

            // return {
            // ...user,
            user.messages = [...user.messages, currentOnBlockUser];
            // };
          });
      }

      initialRecords--;
    }

    const { admins, messages, productComments, products, users } = records;

    writeFileSync("INSERTED_DATA.json", JSON.stringify(records));

    await Promise.all([
      UserModel.insertMany(users),
      AdminModel.insertMany(admins),
      ProductModel.insertMany(products),
      MessageModel.insertMany(messages),
      CommentModel.insertMany(productComments)
      // SuperAdminModel.insertMany(superAdmins),
    ]);
    console.log("Records inserted successfully");
    process.exit(0);
  } catch (error) {
    console.log(`Error Found: ${error.message}`);
    process.exit(1);
  }
})();
