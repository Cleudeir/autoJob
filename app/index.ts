import { replaceContentInFile } from "./replaceContentInFile";
import { exec } from "child_process";

const startModel = async (modelName = "llama2") => {
  await executeCommand("ollama run --help");
  await executeCommand("ollama list");
  await executeCommand(`ollama run ${modelName}`, () =>
    replaceContentInFile(0)
  );
};

function executeCommand(command: string, callback?: () => void): Promise<void> {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error starting model: ${error.message}`);
        reject(error);
        return;
      }
      if (stderr) {
        console.error(`Error starting model: ${stderr}`);
        reject(new Error(stderr));
        return;
      }
      console.log(`successfully: ${stdout}`);
      resolve(callback && callback());
    });
  });
}

startModel();
