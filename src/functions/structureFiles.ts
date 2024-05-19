import * as fsPromises from "fs/promises";

const localPathOut = __dirname.replace("src", "output");

export async function structureFiles(itemInputData: string): Promise<void> {
  try {
    const [fileName] = itemInputData.split("/src/");
    await fsPromises.mkdir(localPathOut, {
      recursive: true,
    });
    const path = localPathOut + "/files.txt";

    await fsPromises.appendFile(
      path,
      "src/" + itemInputData.split("/src/")[1] + "\n",
      "utf-8"
    );
  } catch (error) {
    console.error(error);
  }
}
