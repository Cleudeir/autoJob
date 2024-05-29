import * as fsPromises from "fs/promises";

const localPathOut = __dirname.split("src")[0] + 'output/uniqueFile';


export async function uniqueProject(itemInputData: string): Promise<void> {
  try {
    const [fileName] = itemInputData.split('/src/')
    const contentRead = await fsPromises.readFile(itemInputData, "utf-8");
    await fsPromises.mkdir(localPathOut, {
      recursive: true,
    });
    await fsPromises.appendFile(
      fileName + "/uniqueProject.txt",
      contentRead,
      "utf-8"
    );
  } catch (error) {
    console.error("error: ", error);
  }
}
