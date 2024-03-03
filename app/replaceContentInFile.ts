import * as fsPromises from "fs/promises";
import { requestGPT } from "./requestGPT";

const localPathOut = __dirname.replace("app", "output");

export async function replaceContentInFile(
  itemInputData: string
): Promise<void> {
  if (itemInputData.includes(".ts") || itemInputData.includes(".js")) {
    try {
      const contentRead = await fsPromises.readFile(itemInputData, "utf-8");
      const content = `${contentRead}`;

      const response = await requestGPT({
        content: content,
        type: 0,
      });

      if (!response) return;

      //
      const localPathFileName =
        localPathOut + "/src/" + itemInputData.split("/src/")[0];
      const localPathDir = localPathFileName.split("/").slice(0, -1).join("/");
      await fsPromises.mkdir(localPathDir, {
        recursive: true,
      });

      const contentFilter = response.includes("```")
        ? response.split("```")[1]
        : response;
      await fsPromises.writeFile(localPathFileName, contentFilter, "utf-8");

      const response2 = await requestGPT({
        content: content,
        type: 1,
      });
      if (!response2) return;
      await fsPromises.mkdir(localPathOut, {
        recursive: true,
      });
      const _data = `path: ${itemInputData}\n\n${response2}\n\n`;
      await fsPromises.appendFile(
        localPathOut + "/summarize.txt",
        _data,
        "utf-8"
      );
    } catch (error) {
      console.error("error: ", error);
    }
  } else {
    return;
  }
}
