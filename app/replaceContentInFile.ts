import * as fs from "fs";
import * as fsPromises from "fs/promises";
import * as path from "path";
import { requestGPT } from "./requestGPT";

const filePath = path.resolve("./input/paths.json");
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
    console.log("itemInputData: index-", index, itemInputData);
    console.log("itemOutData: index-", index, itemOutData);
    if (itemInputData.includes(".ts") || itemInputData.includes(".js")) {
      fs.readFile(itemInputData, "utf-8", async (readErr, content) => {
        if (readErr) {
          console.error("Error reading file:", readErr);
          return;
        }
        const prompt = `${content}`;
        try {
          const response1 = await requestGPT({
            prompt,
            type: 0,
            model: "llama2",
          });
          const response2 = await requestGPT({
            prompt: response1,
            type: 1,
            model: "deepseek-coder",
          });
          await fsPromises.mkdir(
            itemOutData.split("/").slice(0, -1).join("/"),
            {
              recursive: true,
            }
          );
          await fsPromises.writeFile(
            itemOutData.split(".")[0] + ".json",
            response2,
            "utf-8"
          );
          replaceContentInFile(index + 1);
        } catch (error) {
          console.error("error: ", error);
        }
      });
    } else {
      replaceContentInFile(index + 1);
      return;
    }
  });
}
