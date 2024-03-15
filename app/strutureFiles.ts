import * as fsPromises from "fs/promises";

const localPathOut = __dirname.replace("app", "output");

export async function strutureFiles(itemInputData: string): Promise<void> {
  try {
  const [fileName] = itemInputData.split('/src/')
  await fsPromises.mkdir(localPathOut, {
    recursive: true,
  });
  await fsPromises.appendFile(
    fileName + "/uniqueProject.txt",
    "src/" + itemInputData.split("/src/")[1] + "\n",
    "utf-8"
  );
  } catch(error){
    console.error(error)
  }
}
