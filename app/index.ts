import * as fs from "fs";
import * as path from "path";

import { replaceContentInFile } from "./replaceContentInFile";
const directory = "/home/user/Documents/teste_Supermercado";
const directoryPath = directory + "/src";
const localPath = __dirname.replace("app", "");

fs.copyFile(
  directory + "/package.json",
  localPath + "/output/package.json",
  (err) => {
    if (err) {
      console.error(err);
      return;
    }
  }
);

readFilesInDirectory(directoryPath);

const pathsProject: any[] = [];
function readFilesInDirectory(directoryPath: string): void {
  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      console.error("Error reading directory:", err);
      return;
    }
    files.forEach((file) => {
      const filePath = path.join(directoryPath, file);
      fs.stat(filePath, (statErr, stats) => {
        if (statErr) {
          console.error("Error getting file stats:", statErr);
          return;
        }
        if (stats.isFile()) {
          // console.log("File:", filePath);
          if (filePath.includes(".ts") || filePath.includes(".js")) {
            moveFiles(filePath);
          }
          pathsProject.push({
            [String(pathsProject.length)]: filePath.replace(directory, ""),
          });
          fs.writeFile(
            localPath + "/output/paths.json",
            JSON.stringify(pathsProject),
            "utf-8",
            (writeErr) => {
              if (writeErr) {
                console.error("Error writing file:", writeErr);
                return;
              }
              console.log("Content replaced in", directoryPath);
            }
          );
        } else if (stats.isDirectory()) {
          console.log("Directory:", filePath);
          readFilesInDirectory(filePath);
        }
      });
    });
  });
}

function moveFiles(filePath: string): void {
  console.log("filePath: ", filePath);
  fs.readFile(filePath, "utf-8", async (readErr, data) => {
    if (readErr) {
      console.error("Error reading file:", readErr);
      return;
    }
    const file = filePath.replace(directory, localPath + "output");
    const dir = file.split("/").slice(0, -1).join("/");

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFile(file, data, "utf-8", (writeErr) => {
      if (writeErr) {
        console.error("Error writing file:", writeErr);
        return;
      }
    });
  });
}

replaceContentInFile();
