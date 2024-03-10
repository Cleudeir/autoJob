import * as fsPromises from "fs/promises";

const localPathOut = __dirname.replace("app", "output");

export async function strutureFiles(itemInputData: string): Promise<void> {
  console.log(" >>>>> start strutureFiles");
  const time = Date.now();

  const localPathFileName =
    localPathOut + "/src/" + itemInputData.split("/src/")[1];
  const localPathDir = localPathFileName.split("/").slice(0, -1).join("/");

  await fsPromises.mkdir(localPathOut, {
    recursive: true,
  });
  await fsPromises.appendFile(
    localPathOut + "/structure.txt",
    "src/" + itemInputData.split("/src/")[1] + "\n",
    "utf-8"
  );

  const min = Math.floor((Date.now() - time) / 1000 / 60);
  const seg = Math.floor((Date.now() - time) / 1000) % 60;
  console.log("localPathFileName: ", localPathFileName);
  console.log("  >>>>> end time: ", min, "min", seg, "seg");
  console.log("---------");
}
