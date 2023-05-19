#!/usr/bin/env node
import yargs from "yargs";
import { spawn } from "cross-spawn";

yargs.command(
  "compute-index <dir> <indexPath> <parsedFusePath>",
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
  },
  (argv) => {
    const { dir, indexPath, parsedFusePath } = argv;
    const command = "yarn";
    const args: string[] = [
      "node",
      require("./PagesIndexer.js"),
      dir as string,
      indexPath as string,
      parsedFusePath as string,
    ];
    const result = spawn(command, args, { stdio: "inherit" });
    result.on("close", (code) => {
      process.exit(code || 0);
    });
  },
);

yargs.parse();
