import * as fsPromises from "fs/promises";
export async function checkFileExists(filePath: string) {
  try {
    await fsPromises.access(filePath, fsPromises.constants.F_OK);
    console.log(`File ${filePath} exists.`);
    return true;
  } catch (error) {
    console.error(`File ${filePath} does not exist.`);
    return false;
  }
}
