import { fileURLToPath } from "url";
import { join, dirname, basename } from "path";

export const file = fileURLToPath(import.meta.url);

const __dirname = (...args) => join(dirname(file), args.join("/"));

export const currentFile = basename(process.argv[1])
export default __dirname;