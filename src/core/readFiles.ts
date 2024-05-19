import * as path from "path";
import * as fsPromises from "fs/promises";

async function find(
  directoryPath: string,
  file: string,
  callback: (file: string) => Promise<void>
) {
  const filePath = path.join(directoryPath, file);
  const stats = await fsPromises.stat(filePath);
  if (stats.isFile()) {
    if (filePath.includes(".ts") || filePath.includes(".js")) {
     await callback(filePath)
    }
  } else if (stats.isDirectory()) {
    await readFilesInDirectory(filePath, callback);
  }
}

export async function readFilesInDirectory(
  directoryPath: string,
  callback: (file: string) => Promise<void>
): Promise<void> {
  try {
    const files = await fsPromises.readdir(directoryPath);
    for (const file of files) {
      await find(directoryPath, file, callback);
    }
  } catch (err) {
    console.error("Error reading directory:", err);
  }
}
