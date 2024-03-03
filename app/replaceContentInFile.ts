import * as fs from "fs";
import * as fsPromises from "fs/promises";
import * as path from "path";
import { requestGPT } from "./requestGPT";

const filePath = path.resolve("./input/paths.json");
const localPathInput = __dirname.replace("app", "input");
const localPathOut = __dirname.replace("app", "output");

function replaceResponse(str: string): string {
  const replace1 = str?.includes("```json")
    ? str?.split("```json")[1]
    : str?.includes("```json")
    ? str?.split("```")[1]
    : str;
  const replace2 = replace1?.startsWith("json")
    ? replace1?.replace("json", "")
    : replace1;
  const replace3 = replace2?.includes("```")
    ? replace2?.split("```")[0]
    : replace2;
  return replace3;
}

export function replaceContentInFile(index: number): void {
  fs.readFile(filePath, "utf-8", async (readErr, data) => {
    if (readErr) {
      console.error("Error reading file:", readErr);
      return;
    }
    const parseData = JSON.parse(data);
    console.log(parseData);
    const itemInputData = localPathInput + parseData[index];
    const itemOutData = localPathOut + parseData[index];
    console.log("itemInputData: index", index, itemInputData);
    console.log("itemOutData: index", index, itemOutData);
    if (itemInputData.includes(".ts") || itemInputData.includes(".js")) {
      fs.readFile(itemInputData, "utf-8", async (readErr, contentRead) => {
        if (readErr) {
          console.error("Error reading file:", readErr);
          return;
        }
        const content = `${contentRead}`;
        try {
          const response1 = await requestGPT({
            content: content,
            type: 0,
          });
          console.log("response1: ", response1);
          if (!response1) return replaceContentInFile(index + 1);

          const response2 = await requestGPT({
            content: replaceResponse(response1),
            type: 1,
          });
          if (!response2) return replaceContentInFile(index + 1);
          console.log("response2: ", response2);

          await fsPromises.mkdir(
            itemOutData.split("/").slice(0, -1).join("/"),
            {
              recursive: true,
            }
          );
          await fsPromises.writeFile(
            itemOutData.split(".")[0] + ".json",
            replaceResponse(response2),
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
