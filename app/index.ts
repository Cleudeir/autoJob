import * as fs from "fs";
import * as path from "path";
import { replaceContentInFile } from "./replaceContentInFile";

const directory = "/home/user/Documents/teste_Supermercado";
const directoryPath = directory + "/src";
const localPath = __dirname.replace("app", "");

fs.copyFile(
  directory + "/package.json",
  localPath + "/input/package.json",
  (err) => {
    if (err) {
      console.error(err);
      return;
    }
  }
);

readFilesInDirectory(directoryPath);

const pathsProject: any[] = [];
async function readFilesInDirectory(directoryPath: string): Promise<void> {
  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      console.error("Error reading directory:", err);
      return;
    }
    files.forEach((file) => {
      const filePath = path.join(directoryPath, file);
      fs.stat(filePath, async (statErr, stats) => {
        if (statErr) {
          console.error("Error getting file stats:", statErr);
          return;
        }
        if (stats.isFile()) {
          if (filePath.includes(".ts") || filePath.includes(".js")) {
            moveFiles(filePath);
          }
          pathsProject.push(filePath.replace(directory, ""));
          await fs.writeFileSync(
            localPath + "/input/paths.json",
            JSON.stringify(pathsProject),
            "utf-8"
          );
        } else if (stats.isDirectory()) {
          readFilesInDirectory(filePath);
        }
      });
    });
  });
}

function moveFiles(filePath: string): void {
  fs.readFile(filePath, "utf-8", async (readErr, data) => {
    console.log("filePath: ", filePath);
    if (readErr) {
      console.error("Error reading file:", readErr);
      return;
    }
    const file = filePath.replace(directory, localPath + "input");
    const dir = file.split("/").slice(0, -1).join("/");

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const fileOut = filePath.replace(directory, localPath + "output");
    const dirOut = fileOut.split("/").slice(0, -1).join("/");

    if (!fs.existsSync(dirOut)) {
      fs.mkdirSync(dirOut, { recursive: true });
    }
    fs.writeFile(file, data, "utf-8", (writeErr) => {
      if (writeErr) {
        console.error("Error writing file:", writeErr);
        return;
      }
    });
  });
}
replaceContentInFile(0);
