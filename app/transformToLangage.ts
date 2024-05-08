import * as fsPromises from "fs/promises";
import { checkFileExists } from "./checkFileExists";
import { requestGPT } from "./requestGPT";

const localPathOut = __dirname.replace("app", "output");

const extractReturnText = (code: string) => {
  const regex = /return\s+([^;]+);/g;
  let match;
  let lastReturnText = "";
  while ((match = regex.exec(code))) {
    lastReturnText = match[1]; // Capture text after "return"
  }
  return `return ${lastReturnText}`;
};

export async function transformToLangage(itemInputData: string): Promise<void> {
  if (itemInputData.toLocaleLowerCase().includes("style")) {
    return;
  }
  const time = Date.now();

  const pathFile = "src/" + itemInputData.split("/src/")[1];
  const path = pathFile.split("/").slice(0, -1).join("/");
  const version = "/";
  const localPathFileName = localPathOut + version + pathFile;
  const localPathDir = localPathOut + version + path;

  const exist = await checkFileExists(localPathFileName);
  if (exist === true) {
    return;
  }
  console.log("localPathFileName: ", localPathFileName);
  try {
    const contentRead = await fsPromises.readFile(itemInputData, "utf-8");

    let prompt = `
you are coder assistant. JavaScript. using Lib React Native. no comment, no explain, only create code.
you are best developer. coding in javascript. no explain. atention write complete code. use camelcase to named variables
create variable named "texts" with all text will show in this screen.
create variable named "language" with value "English". you need to define currente language ( texts[language] ).

response using this struture:
      const texts = { 
        en : {[uniqueWord: string]: string]}
        ptBr : {[uniqueWord: string]: string]}
        es : {[uniqueWord: string]: string]}
      }
      return (
        {content with texts[language]}
      )


 exemple: 
 code 'return (<View><Text>ola mundo</Text></View>)'

 response: 'javascript
  const language = "English";
  const texts = {
    en : {
      'helloWorld' : 'hello world',
    },
    ptBr : {
      'helloWorld' : 'ola mundo',
    }
    es : {
      'helloWorld' : 'hola mundo',
    }
  }
  return (<View><Text>{texts[language]}</Text></View>)
 '
`;

    let response = await requestGPT({
      content: `${extractReturnText(contentRead)}
      ${prompt}`,
    });

    if (!response) return;

    await fsPromises.mkdir(localPathDir, {
      recursive: true,
    });

    await fsPromises.writeFile(localPathFileName, response, "utf-8");
  } catch (error) {
    console.error("error: ", error);
  }

  const min = Math.floor((Date.now() - time) / 1000 / 60);
  const seg = Math.floor((Date.now() - time) / 1000) % 60;
  console.log("  >>>>> end time: ", min, "min", seg, "seg");
  console.log("---------");
}
