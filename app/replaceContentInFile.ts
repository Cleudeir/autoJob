import * as fs from "fs";
import * as path from "path";

const filePath = "/home/user/Documents/teste_Supermercado/output/paths.json";
const localPath = __dirname.replace("dist", "");

export function replaceContentInFile(): void {
  fs.readFile(filePath, "utf-8", async (readErr, data) => {
    if (readErr) {
      console.error("Error reading file:", readErr);
      return;
    }
    console.log("data: ", data);

    /*
    const prompt = `replace ${filePath} with: response only code with the same structure, otimize code : ${data}`;

    const response = await requestGPT({ prompt, apiKey });
    console.log(response);

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
    fs.writeFile(file + "modified", response, "utf-8", (writeErr) => {
      if (writeErr) {
        console.error("Error writing file:", writeErr);
        return;
      }
      console.log("Content replaced in", filePath);
    });
    */
  });
}
