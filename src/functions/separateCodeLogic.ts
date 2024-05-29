import * as fsPromises from "fs/promises";
import { checkFileExists } from "../utils/checkFileExists";
import { ollama } from "../gpt/ollama";
import { gemini } from "../gpt/gemini";

const localPathOut = __dirname.split("src")[0] + "output/separateCodeLogic";

const promptBase = `
original code :
\`\`\`tsx
import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { useState } from 'react';
import { StyleSheet } from 'react-native';

type Item = {
  id: number;
  value: string;
};
export const ExampleComponent: React.FC = ({navigation, route}) => {

  const [item, setItem] = useState('');
  const function1 = (value: string) => {
    console.log(value);
  };
  const function2 = (id: number) => {
    console.log(id);
  };

  return (
    <View style={styles.container}>
      <Text>Item</Text>
      <TextInput
        type="text"
        value={item}
        onChange={(e) => setItem(e)}
      />
      <Button onClick={function1}>Add Item</Button>
      <Button onClick={function2}>Clear Items</Button>    
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
\`\`\`
separate code:

Step 1: moving  code logic to useIndex.ts
exemple: 
\`\`\`ts
import { useState } from 'react';

type Item = {
  id: number;
  value: string;
};

export const useIndex = () => {
  const [item, setItem] = useState('');
  const function1 = (value: string) => {
    console.log(value);
  };
  const function2 = (id: number) => {
    console.log(id);
  };
   return {
    item,
    setItem,
    function1,
    function2,
  };
};
\`\`\`

Step 2: moving code styles to useStyles.ts
exemple: 
\`\`\`ts
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
\`\`\`

Step 3: maintain jsx code to ExampleComponent.tsx and utilizes the useIndex and useStyles.
exemple:
\`\`\`tsx
import React, { useState } from 'react';
import {useIndex} from './useIndex';
import { View, Text, TextInput, Button } from 'react-native';
import {styles} from './useStyles';

export const ExampleComponent: React.FC = ({navigation, route}) => {

  const { item, setItem, function1, function2 } = useIndex();

  return (
    <View style={styles.container}>
      <Text>Item</Text>
      <TextInput
        type="text"
        value={item}
        onChange={(e) => setItem(e)}
      />
      <Button onClick={function1}>Add Item</Button>
      <Button onClick={function2}>Clear Items</Button>    
    </View>
  );
};
\`\`\`
use this code to apply that separate:
`


export async function separateCodeLogic(
  itemInputData: string
): Promise<void> {
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

    const content = (contentRead);
    const input = `${promptBase}\n${content} `;
    let response = await ollama({
      content: input,
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