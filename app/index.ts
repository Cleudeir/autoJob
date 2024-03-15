import { readFilesInDirectory } from "./readFiles";
import { exec } from "child_process";
import fsPromises from "fs/promises";

const startModel = async (modelName = "deepseek-coder") => {
  const localPathOut = __dirname.replace("app", "output");
  await executeCommand("ollama list");
  const directory = "/home/user/Disk/#Documentos/#Dev/CBTC/src";
  //
  await fsPromises.writeFile(localPathOut.replace('/src','') + "/uniqueProject.txt", "", "utf-8");
  await readFilesInDirectory(directory, "structure");
  await readFilesInDirectory(directory, "uniqueProject");
  // 
  await fsPromises.writeFile(localPathOut + "/summarize.txt", "", "utf-8");
  await fsPromises.writeFile(localPathOut + "/teste.tsx", "", "utf-8");
  await readFilesInDirectory(directory, "summary");
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
