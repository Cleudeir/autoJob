import * as fs from "fs";
import * as path from "path";
import * as fsPromises from "fs/promises";
import { replaceContentInFile } from "./replaceContentInFile";
import { strutureFiles } from "./strutureFiles";
import { uniqueProject } from "./uniqueProject";
import { transformToLangage } from "./transformToLangage";

const localPath = __dirname.replace("app", "");

if (!fs.existsSync(localPath + "/output/")) {
  fs.mkdirSync(localPath + "/output/", { recursive: true });
}
if (!fs.existsSync(localPath + "/input/")) {
  fs.mkdirSync(localPath + "/input/", { recursive: true });
}

// function
async function find(
  directoryPath: string,
  file: string,
  type: "structure" | "summary" | "uniqueProject" | "transformToLangage"
) {
  const filePath = path.join(directoryPath, file);
  const stats = await fsPromises.stat(filePath);
  if (stats.isFile()) {
    if (filePath.includes(".ts") || filePath.includes(".js")) {
      if (type === "structure") {
        await strutureFiles(filePath);
      } else if (type === "summary") {
        await replaceContentInFile(filePath);
      } else if (type === "uniqueProject") {
        await uniqueProject(filePath);
      } else if (type === "transformToLangage") {
        await transformToLangage(filePath);
      }
    }
  } else if (stats.isDirectory()) {
    await readFilesInDirectory(filePath, type);
  }
}

export async function readFilesInDirectory(
  directoryPath: string,
  type: "structure" | "summary" | "uniqueProject" | "transformToLangage"
): Promise<void> {
  try {
    const files = await fsPromises.readdir(directoryPath);
    for (const file of files) {
      await find(directoryPath, file, type);
    }
  } catch (err) {
    console.error("Error reading directory:", err);
  }
}
