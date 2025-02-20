const fork = require("child_process").fork

let buildProcess;
const controller = new AbortController();

const build = async () => {
  if (buildProcess) {
    console.log("###### Aborting in-progress build of @userfront/toolkit")
    controller.abort();
  }
  console.log("\n\n###### Building @userfront/toolkit");
  buildProcess = fork(`${__dirname}/build.cjs`, [], { stdio: [process.stdin, process.stdout, process.stderr, "ipc"], cwd: process.cwd(), signal: controller.signal });
  buildProcess.on("exit", () => {
    console.log("###### Done building @userfront/toolkit");
    buildProcess = null;
  })
  
}

const watcher = require('node-watch')(
  `${process.cwd()}/src`, { recursive: true }, (evt, name) => {
    build();
  }
);

process.on('SIGINT', () => {
  buildProcess?.close();
  watcher.close();
});