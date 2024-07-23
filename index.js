import { spawn } from "child_process";
import path from "path";
import chalk from "chalk";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function run() {
  let args = [path.join(__dirname, "app.js"), ...process.argv.slice(2)];

  console.log([process.argv[0], ...args].join("\n"));
  let spawnChild = spawn(process.argv[0], args, {
    stdio: ["inherit", "inherit", "inherit", "ipc"],
  })
    .on("message", (data) => {
      console.log("🚀 ~ file: index.js:19 ~ .on ~ data:", data);
      if (data == "reset") {
        console.log(chalk.bgBlue("Restarting Bot ..."));
        spawnChild.kill();
        run();
        spawnChild = null;
      }
    })
    .on("exit", (code) => {
      console.log("🚀 ~ file: index.js:27 ~ .on ~ code:", code);
      console.error(chalk.bgRed("Exited with code:", code));
      if (code === "." || code === 1 || code === 0) run();
    });
}
run();
