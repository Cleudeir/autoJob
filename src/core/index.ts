import { exec } from "child_process";
import { readFilesInDirectory } from "./readFiles";
import { summary } from "../functions/summary";
import { transformToLanguage } from "../functions/transformToLanguage";
import { uniqueProject } from "../functions/uniqueProject";
import { structureFiles } from "../functions/structureFiles";

export const core = async (argument: 'structure' | 'transformToLanguage' | 'summary' | 'uniqueProject', directory: string) => {
  if (argument === "structure") {
    return await readFilesInDirectory(directory, async (filePath) => await structureFiles(filePath));
  } else if (argument === 'transformToLanguage') {
    await readFilesInDirectory(directory, async (filePath) => await transformToLanguage(filePath));
  } else if (argument === 'uniqueProject') {
    await readFilesInDirectory(directory, async (filePath) => await uniqueProject(filePath));
  } else if (argument === 'summary') {
    await readFilesInDirectory(directory, async (filePath) => await summary(filePath));
  }
  await executeCommand("echo finalizando o app");
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




