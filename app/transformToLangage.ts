import * as fsPromises from "fs/promises";
import { requestGPT } from "./requestGPT";

const localPathOut = __dirname.replace("app", "output");

export async function transformToLangage(itemInputData: string): Promise<void> {
  console.log(" >>>>> start replaceContentInFile");
  const time = Date.now();

  const pathFile = "src/" + itemInputData.split("/src/")[1];
  const path = pathFile.split("/").slice(0, -1).join("/");
  const version = "/";
  const localPathFileName = localPathOut + version + pathFile;
  const localPathDir = localPathOut + version + path;

  console.log("localPathFileName: ", localPathFileName);
  console.log("localPathDir: ", localPathDir);

  await fsPromises.mkdir(localPathDir, {
    recursive: true,
  });

  try {
    const contentRead = await fsPromises.readFile(itemInputData, "utf-8");

    const response2 = await requestGPT({
      content: `${contentRead}
you are coder assistant. JavaScript / Typescript. using Lib React Native.
create variable named "texto" with all texts inside code 
struture : 
      export const texto = { 
        'English' : {[simplyName: string]: string]}
        'Brazilian' : {[simplyName: string]: string]}
        'spanish' : {[simplyName: string]: string]}
      }
write only this variavel, no comment, no explain
      `,
    });
    if (!response2) return;
    await fsPromises.writeFile(localPathFileName, response2, "utf-8");
  } catch (error) {
    console.error("error: ", error);
  }

  const min = Math.floor((Date.now() - time) / 1000 / 60);
  const seg = Math.floor((Date.now() - time) / 1000) % 60;
  console.log("localPathFileName: ", localPathFileName);
  console.log("  >>>>> end time: ", min, "min", seg, "seg");
  console.log("---------");
}
