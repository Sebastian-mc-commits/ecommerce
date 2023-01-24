import { fileURLToPath } from "url";
import { join, dirname } from "path";

export const file = fileURLToPath(import.meta.url);

const __dirname = (...args) => join(dirname(file), args.join("/"));

export default __dirname;