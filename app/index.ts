import { readFilesInDirectory } from "./readFiles";
import { replaceContentInFile } from "./replaceContentInFile";
import { exec } from "child_process";

const startModel = async (modelName = "deepseek-coder") => {
  await executeCommand("ollama list");
  const directory = "/home/user/Documents/#Dev/AmazonHouse/src/components";
  readFilesInDirectory(directory);
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
