import  MessageModel from "../models/messages.model.js"

export const createMessage = () => {
    const message = MessageModel.create(data);

    return message
}