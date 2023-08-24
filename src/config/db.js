import mongoose from "mongoose";
import config from "./config.js";

mongoose.set("strictQuery", false);
mongoose.connect(config.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, (err) => {
    if (err) {
        console.log("Message: ", err.message);
        process.exit(1)
    }
    else {
        console.log("database connected");
    }
});
