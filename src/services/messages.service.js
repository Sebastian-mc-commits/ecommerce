import MessageModel from "../models/messages.model.js"
import UserModel from "../models/user.models.js";

export const createMessage = (data) => {
    try {
        const message = MessageModel.create(data);
        return message
    }
    catch (err) {
        throw new Error(err);
    }
}

export const getMessagesById = (_id) => {
    try {
        const message = MessageModel.find({ _id });
        return message
    }
    catch (err) {
        throw new Error(err);
    }
}

export const getMessagesOfUser = async (userId) => {
    userId = (await import("mongoose")).Types.ObjectId(userId);

    const aggregate = [

        {
            $match: {
                $or: [
                    {
                        from: {$eq: userId}
                    },
                    {
                        to: {$eq: userId}
                    }
                ]
            }
        },

        {
            $group: {
                counter: {$sum: 1},
                _id: "$to",
                message: {
                    $push: "$$ROOT"
                },
            }
        },

        {
            $lookup: {
                from: "users",
                localField: "_id",
                foreignField: "_id",
                as: "userDestination"
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "message.from",
                foreignField: "_id",
                as: "userFrom"
            }
        },

        {
            $project: {
                "userDestination.name": 1,
                "userFrom.name": 1,
                "userDestination.email": 1,
                "userFrom.email": 1,
                message: 1,
                counter: 1
            }
        }

       

    ];

    const aggregate2 = [
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
                "userSender.auth.email": 1,
            }
        },

        // {
        //     $group: {
        //         _id: "$userMessages._id",
        //         root: {$push: "$$ROOT"},
        //     }
        // },

        // {
        //     $lookup: {
        //         from: "users",
        //         localField: "message._id",
        //         foreignField: ""
        //     }
        // }
    ];

    const globalAggregate = [
        {
            $match: {
                "adminOptions.isAdmin": true
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
                "userSender.email": 1,
            }
        },
    ];
    try {
        // const message = MessageModel.find({ destination: id });
        // const {messages} = await UserModel.findOne({_id: userId}).populate({path: "messages", populate: {path: "to", select: "name"}})
        const messages = await UserModel.aggregate(aggregate2);
        return messages;
    }
    catch (err) {
        throw new Error(err);
    }
}