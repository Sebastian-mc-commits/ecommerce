import UserModel from "../models/user.models.js";
import authMessages from "../utils/messages/messages.auth.utils.js";
import serverMessages from "../utils/messages/messages.server.utils.js";
import userMessages from "../utils/messages/messages.user.utils.js";

export const getUser = async ({ auth }) => {
    try {
        const user = await UserModel.findOne({ "auth.email": auth.email, "auth.provider": "EmailPasswordAuth" });
        if (!await user?.comparePassword(auth.password)) throw new Error(authMessages.FAIL_LOGIN);
        return user;
    }
    catch (err) {
        if (err.message !== authMessages.FAIL_LOGIN) {

            err.message = serverMessages.SERVER_FAILURE;
        }
        throw new Error(err.message);
    }
}

export const getUserById = async (_id) => {
    try {
        const user = await UserModel.findOne({ _id });
        return user;
    }
    catch (err) {
        throw new Error(err);
    }
}

export const getUserOrCreateOne = async (data) => {
    let user = await UserModel.findOne({ "auth.email": data.auth.email });

    try {

        if (!user) {
            user = await UserModel.create({ ...data });
            return user;
        };

        if (user.auth.provider !== data.auth.provider) throw new Error(authMessages.PROVIDER_COLLISION);
        // const user = await UserModel.findOneAndUpdate(query, {...data}, {upsert: true, new: true, setDefaultsOnInsert: true });
        return user;
    }
    catch (err) {
        if (err.message !== authMessages.PROVIDER_COLLISION) {

            err.message = serverMessages.SERVER_FAILURE;
        }
        throw new Error(err.message);
    }
}
export const createUser = async (data) => {
    try {
        if (await UserModel.findOne({ "auth.email": data.auth.email })) throw new Error(authMessages.DUPLICATE_EMAIL);

        if (!!!data?.auth.password) throw new Error(authMessages.PASSWORD_MISSING);

        const user = await UserModel.create({ ...data });
        // const user = new UserModel({...data});
        // const result = await user.save();
        return user;
    }
    catch (err) {
        if (err.message !== authMessages.PASSWORD_MISSING &&
            err.message !== authMessages.DUPLICATE_EMAIL) {

            err.message = serverMessages.SERVER_FAILURE;
        }
        throw new Error(err.message);
    }
}

export const getUsers = async (skip = 0) => {
    try {

        const aggregate = [
            {
                $match: {
                    "superAdminOptions.isSuperAdmin": false
                }
            },

            {
                $skip: skip
            },

            {
                $limit: 10
            },

            {
                $project: {
                    name: 1,
                    last_name: 1,
                    "adminOptions.isAdmin": 1,
                    "auth": 1,
                }
            },

            {
                $project: {
                    "auth.password": 0,
                }
            }
        ];
        const users = await UserModel.aggregate(aggregate);
        // const users = await UserModel.paginate({}, {limit: 6, page, lean: true});
        return users;
    }
    catch {
        throw new Error(serverMessages.SERVER_FAILURE);
    }
}

export const getAdmins = async () => {
    try {
        const users = await UserModel.find({ "adminOptions.isAdmin": true }).select("-password -cart -orders").lean();
        // const users = await UserModel.paginate({}, {limit: 6, page, lean: true});
        return users;
    }
    catch {
        throw new Error(serverMessages.SERVER_FAILURE);
    }
}

export const getUserForSuperAdmin = async (_id) => {
    try {
        const user = await UserModel.findOne({ _id }).select("-password").lean();
        return user;
    }
    catch (err) {
        throw new Error(err);
    }
}

// export const deleteUser = async ({ auth, _id }) => {
//     try {
//         await UserModel.deleteOne({ "auth.email": auth.email, password: auth.password, _id });
//     }
//     catch (err) {
//         throw new Error(err);
//     }
// }

// export const updateUser = async ({ auth, _id }) => {
//     try {
//         const user = await UserModel.findByIdAndUpdate({ _id, "auth.email": auth.email, password: auth.password }, data, { new: true });
//         return user;
//     }
//     catch (err) {
//         throw new Error(err);
//     }
// }

export const userToAdmin = async (adminId, _id) => {
    try {
        // const user = await UserModel.updateOne({ _id }, {$set: {name: "sebastian mac"} }, {upsert: false});
        const user = await UserModel.findOne({ _id, "superAdminOptions.isSuperAdmin": false });
        await user.setToAdmin(adminId);
        return user;
    }
    catch (err) {
        throw new Error(err.message);
    }
}

export const unsetUserToAdmin = async (adminId, _id) => {
    try {
        // const user = await UserModel.updateOne({ _id }, {$set: {name: "sebastian mac"} }, {upsert: false});
        const user = await UserModel.findOne({ _id, "superAdminOptions.isSuperAdmin": false });
        await user.unsetUserToAdmin(adminId);
        return user;
    }
    catch (err) {
        throw new Error(err);
    }
}

export const getDeletedProducts = async (_id) => {
    try {
        const products = await UserModel.findOne({ _id, "adminOptions.isAdmin": true }).populate("adminOptions.deletedProducts");
        return products
    }
    catch {
        throw new Error(userMessages.NOT_FOUND);
    }
}

export const getUpdatedProducts = async (_id) => {
    try {
        const products = await UserModel.findOne({ _id, "adminOptions.isAdmin": true }).populate("adminOptions.updatedProducts");
        return products
    }
    catch {
        throw new Error(userMessages.NOT_FOUND);
    }
}

export const keepTrack = async () => {
    const user = await UserModel.updateMany({}, { $set: { isAdmin: false } }, { upsert: false });
    return user;
}

// (async () => {
//     try {
//         // await UserModel.updateMany({}, {
//         //     $set: {
//         //         platform: {
//         //             email: email,
//         //             provider: "EmailPasswordAuth"
//         //         }
//         //     }
//         // })

//         await UserModel.find().snapshot().forEach(
//             async function (elem) {
//                 console.log("elem");
//                 console.log(elem);
//                 await UserModel.updateOne(
//                     {
//                         _id: elem._id
//                     },
//                     {
//                         $set: {
//                             platform: {
//                                 email: elem.email,
//                                 provider: "EmailPasswordAuth"
//                             }
//                         }
//                     }
//                 );
//             }
//         );

//         console.log("Setttttt");
//     }
//     catch (err) {
//         console.log("Error: " + err.message);
//     }
// })();