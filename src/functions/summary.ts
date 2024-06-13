import * as fsPromises from "fs/promises";
import { ollama } from "../gpt/ollama";
import { extractCodeFromTripleBackticks } from '../utils/extractCodeFromTripleBackticks';

const localPathOut = __dirname.split("src")[0] + 'output/summary';

let count = 0;
export async function summary(
  itemInputData: string
): Promise<void> {
  await fsPromises.mkdir(localPathOut, {
    recursive: true,
  });
  const time = Date.now();
  if (count === 0) {
    await fsPromises.writeFile(
      localPathOut + `/summarize.txt`,
      '',
      "utf-8"
    );
  }
  count += 1;
  try {
    const contentRead = await fsPromises.readFile(itemInputData, "utf-8");
    const response = await ollama({
      content: `${contentRead}, to be create succinct summary the business rule in once sentence, explain like i'm 5 years old.
      not technical, no code, no comments, no explanation. create only summary.`,
      model: 'phi3:14b-medium-128k-instruct-q3_K_M',
    });
    if (!response) return;

    console.log('itemInputData: ', JSON.stringify(itemInputData, null, 2));
    const _data = `${itemInputData?.includes('/src/') ? itemInputData.split('/src/')[1] : itemInputData}#${response}\n`;

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
