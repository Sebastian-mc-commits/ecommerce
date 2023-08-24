import __dirname, { currentFile } from "../__dirname.js";
import { program } from "commander";

const optionalCommanderFiles = "cmp";
const extNames = currentFile.split(".");

program
  .option(
    "-f, --fakerRecords <fk>",
    "Faker records for the database (available in development mode)",
    10
  )
  .requiredOption(
    "-s, --store <st>",
    "Select the desire database for the app",
    "mysql"
  );

if (!extNames.includes(optionalCommanderFiles)) {
  program
    .requiredOption("-p, --port <port>", "Application Port")
    .requiredOption(
      "-m, --mode <mode>",
      "Running Mode of the app (Development mode || Production done)"
    );
}

program.parse(process.argv);

export default program;
