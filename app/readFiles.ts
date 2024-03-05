import * as fs from "fs";
import * as path from "path";
import * as fsPromises from "fs/promises";
import { replaceContentInFile } from "./replaceContentInFile";

const localPath = __dirname.replace("app", "");

if (!fs.existsSync(localPath + "/output/")) {
  fs.mkdirSync(localPath + "/output/", { recursive: true });
}
if (!fs.existsSync(localPath + "/input/")) {
  fs.mkdirSync(localPath + "/input/", { recursive: true });
}

// function
async function find(directoryPath: string, file: string) {
  const filePath = path.join(directoryPath, file);
  const stats = await fsPromises.stat(filePath);
  if (stats.isFile()) {
    if (filePath.includes(".tsx") || filePath.includes(".jsx")) {
      console.log("filePath: ", filePath);
      await replaceContentInFile(filePath);
    }
  } else if (stats.isDirectory()) {
    await readFilesInDirectory(filePath);
  }
}

export async function readFilesInDirectory(
  directoryPath: string
): Promise<void> {
  try {
    const files = await fsPromises.readdir(directoryPath);
    for (const file of files) {
      await find(directoryPath, file);
    }
  } catch (err) {
    console.error("Error reading directory:", err);
  }
}
