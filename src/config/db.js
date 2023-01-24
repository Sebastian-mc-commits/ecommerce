import mongoose from "mongoose";
import {config} from "dotenv";

config()
mongoose.set("strictQuery", false);
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, (err) => {
    if (err) {
        console.log("Message: ", err.message);
    }
    else {
        console.log("database connected");
    }
});
