#!/usr/bin/env node
import yargs from "yargs";
import { spawn } from "cross-spawn";

yargs.command(
  "compute-index <dir> <indexPath> <parsedFusePath> <generateAbsolutePaths>",
  "Run the pages indexer",
  (yargs) => {
    yargs.positional("dir", {
      describe:
        "The path to the folder which contains all your pages, ie: path/to/pages folder for NextJS",
      type: "string",
    });
    yargs.positional("indexPath", {
      describe:
        "The path for the file to be created which contains all your jsx tree components with other relevant information",
      type: "string",
    });
    yargs.positional("parsedFusePath", {
      describe:
        "The path for the file to be created which contains a fuse index to ease the search",
      type: "string",
    });
    yargs.positional("generateAbsolutePaths", {
      describe:
        "Whether to generate absolute paths for the pages or not. Defaults to false",
      type: "boolean",
    });
  },
  (argv) => {
    const { dir, indexPath, parsedFusePath, generateAbsolutePaths } = argv;
    const command = "yarn";
    const args: string[] = [
      "node",
      require("./PagesIndexer.js"),
      dir as string,
      indexPath as string,
      parsedFusePath as string,
      (generateAbsolutePaths ?? false) as boolean,
    ];
    const result = spawn(command, args, { stdio: "inherit" });
    result.on("close", (code) => {
      process.exit(code || 0);
    });
  },
);

yargs.parse();
