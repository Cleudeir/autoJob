import * as fsPromises from "fs/promises";
import { requestGPT } from "./requestGPT";

const localPathOut = __dirname.replace("app", "output");
let count = 0;
export async function replaceContentInFile(
  itemInputData: string
): Promise<void> {
  console.log(" >>>>> start");
  const time = Date.now();

  const localPathFileName =
    localPathOut + "/src/" + itemInputData.split("/src/")[1];
  const localPathDir = localPathFileName.split("/").slice(0, -1).join("/");

  if (count === 0) {
    await fsPromises.writeFile(
      localPathOut + "/summarize.txt",
      "Sumary:\n\n",
      "utf-8"
    );
    await fsPromises.writeFile(
      localPathOut + "/teste.tsx",
      "Sumary:\n\n",
      "utf-8"
    );
  }
  count++;
  try {
    const contentRead = await fsPromises.readFile(itemInputData, "utf-8");
    const content = `${contentRead}`;

    //
    if (false) {
      const response = await requestGPT({
        content: content,
        type: 0,
      });

      if (!response) return;
      await fsPromises.mkdir(localPathDir, {
        recursive: true,
      });
      fsPromises.writeFile(localPathFileName, response, "utf-8");
    }

    if (true) {
      const response2 = await requestGPT({
        content: content,
        type: 1,
      });
      if (!response2) return;
      await fsPromises.mkdir(localPathOut, {
        recursive: true,
      });
      const _data = `path: ${itemInputData.split("/src/")[1]}
      \n\n${response2}\n\n`;

      await fsPromises.appendFile(
        localPathOut + "/summarize.txt",
        _data,
        "utf-8"
      );

      const response3 = await requestGPT({
        content: _data,
        type: 3,
      });

      if (!response3) return;
      await fsPromises.mkdir(localPathOut, {
        recursive: true,
      });
      await fsPromises.appendFile(
        localPathOut + "/teste.tsx",
        response3,
        "utf-8"
      );
    }
  } catch (error) {
    console.error("error: ", error);
  }

  const min = Math.floor((Date.now() - time) / 1000 / 60);
  const seg = Math.floor((Date.now() - time) / 1000) % 60;
  console.log("localPathFileName: ", localPathFileName);
  console.log("  >>>>> end time: ", min, "min", seg, "seg");
  console.log("count: ", count);
  console.log("---------");
}
