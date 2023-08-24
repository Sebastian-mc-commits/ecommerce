import MessageModel from "../models/messages.model.js";
import UserModel from "../models/user.models.js";
import tryCatchHandler from "../utils/functions/tryCatch.utils.js";

export const createMessage = (data) => {
  tryCatchHandler({
    fn: async () => {
      const message = MessageModel.create(data);
      return message;
    }
  });
};

export const getMessagesById = (_id) => {
  tryCatchHandler({
    fn: async () => {
      const message = MessageModel.find({ _id });
      return message;
    }
  });
};

export const getMessagesOfUser = async (userId) => {
  userId = (await import("mongoose")).Types.ObjectId(userId);

  const aggregate = [
    {
      $match: {
        _id: userId
      }
    },
    {
      $lookup: {
        from: "messages",
        localField: "messages",
        foreignField: "_id",
        as: "userMessages"
      }
    },

    {
      $lookup: {
        from: "users",
        localField: "userMessages._id",
        foreignField: "messages",
        as: "userSender"
      }
    },

    {
      $project: {
        _id: 0,
        userMessages: 1,
        "userSender.name": 1,
        "userSender._id": 1,
        "userSender.auth.email": 1
      }
    }
  ];

  tryCatchHandler({
    fn: async () => {
      const messages = await UserModel.aggregate(aggregate);
      return messages;
    }
  });
};
