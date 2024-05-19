import * as fsPromises from "fs/promises";
import { ollama } from "../gpt/ollama";

const localPathOut = __dirname.split("src")[0]+ 'output/summary';

let count = 0;
export async function summary(
  itemInputData: string
): Promise<void> {
  console.log(" >>>>> start replaceContentInFile");
  const time = Date.now();
  if(count === 0 ){
    count += 1;
    await fsPromises.writeFile(
      localPathOut + `/summarize.txt`,
      '',
      "utf-8"
    ); 
  }
  
  try {
    const contentRead = await fsPromises.readFile(itemInputData, "utf-8");  
    const response = await ollama({
      content: `${contentRead} +  \nto be create succinct summary not technical, explain business rule this file`,
    });
    if (!response) return;
    await fsPromises.mkdir(localPathOut, {
      recursive: true,
    });
    const _data = `path: ${itemInputData.split("/src/")[1]}
      \n\n${response}\n\n`;

    await fsPromises.appendFile(
      localPathOut + `/summarize.txt`,
      _data,
      "utf-8"
    ); 
  } catch (error) {
    console.error("error: ", error);
  }

  const min = Math.floor((Date.now() - time) / 1000 / 60);
  const seg = Math.floor((Date.now() - time) / 1000) % 60;
  console.log("  >>>>> end time: ", min, "min", seg, "seg");

  console.log("---------");
}
