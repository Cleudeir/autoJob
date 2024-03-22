import * as fsPromises from "fs/promises";
import { requestGPT } from "./requestGPT";

const localPathOut = __dirname.replace("app", "output");
let count = 0;
export async function replaceContentInFile(
  itemInputData: string
): Promise<void> {
  console.log(" >>>>> start replaceContentInFile");
  const time = Date.now();

  const localPathFileName =
    localPathOut + "/src/" + itemInputData.split("/src/")[1];
  const localPathDir = localPathFileName.split("/").slice(0, -1).join("/");
  count++;
  try {
    const contentRead = await fsPromises.readFile(itemInputData, "utf-8");
    const readStructure = await fsPromises.readFile(
      localPathOut + "/structure.txt",
      "utf-8"
    );
    const content = `structure project:\n${readStructure}\n${contentRead} `;

    const response2 = await requestGPT({
      content: `${content} +  \nto be succinct json format with summary: 
        {
          "libs": string[] ,
         "name" (obs.: exported function name): string,
         "input": { [name: string]: type },
         "useState": { [name: string]: type },
         "component React": list all,
         "explain" (explain to do): string,
         "business rule" : string,  
        }
        use types to resume, return only json`,
    });
    if (!response2) return;
    await fsPromises.mkdir(localPathOut, {
      recursive: true,
    });
    const _data = `path: ${itemInputData.split("/src/")[1]}
      \n\n${response2}\n\n`;

    await fsPromises.appendFile(
      localPathOut + `/${Date.now() / 1000}_summarize.txt`,
      _data,
      "utf-8"
    );

    const response3 = await requestGPT({
      content: `${_data} +  \nCreate a new component React native based on this code, use only this code, no explanation, no other information, typescript code, code format`,
    });

    if (!response3) return;
    await fsPromises.mkdir(localPathOut, {
      recursive: true,
    });
    await fsPromises.appendFile(
      localPathOut + `/${Date.now() / 1000}_recreate.txt`,
      response3,
      "utf-8"
    );
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
