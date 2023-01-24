import fs from "fs";
import __dirname from "../__dirname.js";

class Comments{

    #comments;

    constructor(file){
        this.path = __dirname("data", file);
        this.#comments = fs.existsSync(this.path) ? JSON.parse(fs.readFileSync(this.path)) : [];
    }

    #uploadComments = () => fs.writeFileSync(this.path, JSON.stringify( this.#comments ));

    getComments = (id) => this.#comments.filter( comment => comment.room == id);

    addComment = (comment) => {
        this.#comments.push(comment)
        return this.#uploadComments();
    };
}

export default new Comments("comments.json");