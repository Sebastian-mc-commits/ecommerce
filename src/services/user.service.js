import UserModel from "../models/user.models.js";

export const getUser = async ({ email, password }) => {
    try {
        const user = await UserModel.findOne({ email });
        if (!await user.comparePassword(password)) throw new Error("Incorrect Password");
        return user;
    }
    catch (err) {
        throw new Error(err);
    }
}

export const createUser = async (data) => {
    try {
        if (await UserModel.findOne({ email: data.email })) throw new Error("Email already in use");
        const user = await UserModel.create({...data});
        // const user = new UserModel({...data});
        // const result = await user.save();
        return user;
    }
    catch (err) {
        throw new Error(err);
    }
}

export const getUsers = async () => {
    try {
        const users = await UserModel.find().select("-password").lean();
        // const users = await UserModel.paginate({}, {limit: 6, page, lean: true});
        return users;
    }
    catch (err) {
        throw new Error(err);
    }
}

export const getUserForSuperAdmin = async (_id) => {
    try {
        const user = await UserModel.findOne({_id}).select("-password").lean();
        return user;
    }
    catch (err) {
        throw new Error(err);
    }
}

export const deleteUser = async ({email, password, _id}) => {
    try {
        await UserModel.deleteOne({email, password, _id });        
    }
    catch (err) {
        throw new Error(err);
    }
}

export const updateUser = async ({email, password, _id }) => {
    try {
        const user = await UserModel.findByIdAndUpdate({ _id, email, password }, data, { new: true });
        return user;
    }
    catch (err) {
        throw new Error(err);
    }
}

export const userToAdmin = async (adminId, _id) => {
    try {
        // const user = await UserModel.updateOne({ _id }, {$set: {name: "sebastian mac"} }, {upsert: false});
        const user = await UserModel.findOne({_id});
        const response = await user.setToAdmin(adminId);
        return response;
    }
    catch (err) {
        throw new Error(err);
    }
}

export const unsetUserToAdmin = async (adminId, _id) => {
    try {
        // const user = await UserModel.updateOne({ _id }, {$set: {name: "sebastian mac"} }, {upsert: false});
        const user = await UserModel.findOne({_id});
        const response = await user.unsetUserToAdmin(adminId);
        return response;
    }
    catch (err) {
        throw new Error(err);
    }
}

export const keepTrack = async () => {
    const user = await UserModel.updateMany({}, {$set: {isAdmin: false} }, {upsert: false});
    return user;
}