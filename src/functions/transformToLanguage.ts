import * as fsPromises from "fs/promises";
import { checkFileExists } from "../utils/checkFileExists";
import { ollama } from "../gpt/ollama";

const localPathOut = __dirname.split("src")[0]+ 'output/transformToLanguage';


const extractReturnText = (code: string) => {
  const lastIndex = code.lastIndexOf("return");
  if (lastIndex !== -1) {
    const text = code.substring(lastIndex);
    return text;
  } else {
    return "";
  }
};

export async function transformToLanguage(itemInputData: string): Promise<void> {
  if (itemInputData.toLocaleLowerCase().includes("style")) {
    return;
  }

  const time = Date.now();

  const pathFile = "src/" + itemInputData.split("/src/")[1]; 
  
  const path = pathFile.split("/").slice(0, -1).join("/");
  const version = "/";
  const localPathFileName = localPathOut + version + pathFile; 
  const localPathDir = localPathOut + version + path;


  await fsPromises.mkdir(localPathDir, {
    recursive: true,
  });

 
  const exist = await checkFileExists(localPathFileName);
  if (exist === true) {
    return;
  }  
  try {
    const contentRead = await fsPromises.readFile(itemInputData, "utf-8");

    let command = `
you are coder assistant. JavaScript. using Lib React Native. no comment, no explain, only create code.
you are best developer. coding in javascript. no explain. attention write complete code. use camelCase to named variables
create variable named "texts" with all text will show in this screen.
create variable named "language" with value "English". you need to define current language ( texts[language] ).

response using this structure:
      const language = "en";
      const texts = { 
        en : {[uniqueWord: string]: string]}
        ptBr : {[uniqueWord: string]: string]}
        es : {[uniqueWord: string]: string]}
        fr : {[uniqueWord: string]: string]}
      }
      return (
        {content with texts[language]}
      )


 exemple: 
 code ' return (
  <View> 
      <OtherComponents/>
      <Text>ola mundo</Text>
      <OtherComponents/>
  </View>) '

 response: 'javascript
  const language = "en";
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
    fr: {
      'helloWorld' : 'bonjour monde',
    }
  }
  return (
  <View> 
      <OtherComponents/>
      <Text>{texts[language]}</Text>
      <OtherComponents/>
  </View>)


  not summarize code.
 '
`;
    const content = extractReturnText(contentRead); 
    const input = `${content} ${command}`;
    let response = await ollama({
      content: input,
    });

    if (!response) return;

    response = await ollama({
      content: `that is input:${input}, that is output: ${response}, verify if response is correct, if not, change it. certificate that code was complete.`,
    });
    if (!response) return;

    

    await fsPromises.writeFile(localPathFileName, response, "utf-8");
  } catch (error) {
    console.error("error: ", error);
  }

  const min = Math.floor((Date.now() - time) / 1000 / 60);
  const seg = Math.floor((Date.now() - time) / 1000) % 60;
  console.log("  >>>>> end time: ", min, "min", seg, "seg");
  console.log("---------");
}
