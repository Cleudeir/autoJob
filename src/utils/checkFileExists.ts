import * as fsPromises from "fs/promises";
export async function checkFileExists(filePath: string) {
  try {
    await fsPromises.access(filePath, fsPromises.constants.F_OK);
    return true;
  } catch (error) {
    return false;
  }
}
