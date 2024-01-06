import * as fs from "fs";
import * as path from "path";
import { apiKey } from "../.env";
import { requestGPT } from "./requestGPT";

const filePath = path.resolve("./input/paths.json");
console.log("filePath: ", filePath);

const localPathInput = __dirname.replace("app", "input");
const localPathOut = __dirname.replace("app", "output");

export function replaceContentInFile(index: number): void {
  fs.readFile(filePath, "utf-8", async (readErr, data) => {
    if (readErr) {
      console.error("Error reading file:", readErr);
      return;
    }

    const parseData = JSON.parse(data);
    const itemInputData = localPathInput + parseData[index];
    const itemOutData = localPathOut + parseData[index];

    console.log("data: ", localPathInput + itemInputData);
    if (itemInputData.includes(".ts") || itemInputData.includes(".js")) {
      fs.readFile(itemInputData, "utf-8", async (readErr, item) => {
        if (readErr) {
          console.error("Error reading file:", readErr);
          return replaceContentInFile(index + 1);
        }
        console.log(item);

        const prompt = `replace ${filePath} with: response only code with the same structure, otimize code : ${parseData}`;
        try {
          const response = await requestGPT({ prompt, apiKey });
          console.log(response);

          fs.writeFile(
            itemOutData,
            JSON.stringify(response),
            "utf-8",
            (writeErr) => {
              if (writeErr) {
                console.error("Error writing file:", writeErr);
              }
              console.log("Content replaced in", index + 1);
              return replaceContentInFile(index + 1);
            }
          );
        } catch (error) {
          console.error("error: ", error);
        }
      });
    } else {
      return replaceContentInFile(index + 1);
    }
  });
}
