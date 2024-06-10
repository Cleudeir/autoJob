import * as fsPromises from "fs/promises";
import { checkFileExists } from "../utils/checkFileExists";
import { ollama } from "../gpt/ollama";
import { gemini } from "../gpt/gemini";
import { extractCodeBlocks } from "../utils/extractCodeBlocks";
import { extractCodeFromTripleBackticks } from "../utils/extractCodeFromTripleBackticks";

const localPathOut = __dirname.split("src")[0] + "output/separateCodeLogic" + '/';

const promptBase = `
Act as a React Native developer, based in this exemple, rewrite this code based in this example, separate code, write complete code:
#Exemple code :
\`\`\`tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Button } from 'react-native';
import { useState } from 'react';
import { StyleSheet } from 'react-native';
type ItemType = {
  id: number;
  value: string;
};
type navigationType = {
  navigate: (screen: string) => void;
};
type routeType = {
  params: {
    item: string;
  };
  name: string;
};
export const ExampleComponent: React.FC = ({navigation, route}: {navigation: navigationType, route: routeType}) => {
  const [data, setData] = useState('');
  const filtros = [{
    id: 1,
    nome: 'Todos',
    }]
  const _function = async () => {
    const sum = 1 + 1 
    return sum
  } 
  const HeaderCard = ({ item }: any) => {
    return (
      <TouchableOpacity
        style={styles.headerCard}
        onPress={() => setData(item.id)}>
        <Text style={styles.nome}>{item.nome}</Text>
      </TouchableOpacity>
    );
  };
  return (
    <View style={styles.container}>
       <FlatList data={filtros} renderItem={({ item, index }) => <HeaderCard item={item} />} />
      <Text>{data}</Text>
      <Button onPress={_function} />
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
#Example response:
step 1
\`\`\`ts
import { useState } from 'react';
type ItemType = {
  id: number;
  value: string;
};
export const useIndex = () => {
 const [data, setData] = useState('');
  const _function = async () => {
    const sum = 1 + 1 
    return sum
  } 
  const filtros = [{
    id: 1,
    nome: 'Todos',
    }]
   return {filtros,item,data, setData, _function};
};
\`\`\`
step 2
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
step 3
\`\`\`ts
export type ItemType = {
  id: number;
  value: string;
};
export type navigationType = {
  navigate: (screen: string) => void;
};
export type routeType = {
  params: {
    item: string;
  };
  name: string;
};
\`\`\`
step 4
\`\`\`tsx
import React, { useState } from 'react';
import {useIndex} from './useIndex';
import { View, Text, FlatList } from 'react-native';
import {styles} from './useStyles';
import {navigationType, routeType} from './useTypes';
export const ExampleComponent: React.FC = ({navigation, route}: {navigation: navigationType, route: routeType}) => {
  const { setData, data, filtros, _function } = useIndex();
  return (
    <View style={styles.container}>
       <FlatList
          data={filtros} renderItem={({ item, index }) => <HeaderCard item={item} setData={setItem} />}
        />
      <Text>{Data}</Text>
      <Button onPress={_function} />
    </View>
  );
};
\`\`\`

make same changes.
step 1: "useIndex.tsx", move all logics (functions, states, useEffects).
step 2: "useStyles.ts", move all styles.
step 3: "useTypes.tsx", move all types and interfaces.
step 4: "index.tsx", move all jsx/tsx and utilizes the useIndex, useStyles and useTypes.

not use "export default", no comments, no explain. create separated file only if exists code in this file.
in this code:
`


export async function separateCodeLogic(
  itemInputData: string
): Promise<void> {
  if (itemInputData.toLocaleLowerCase().includes("style")) {
    return;
  }

  const time = Date.now();

  const pathWithFileName = "src/" + itemInputData.split("/src/")[1];

  const path = pathWithFileName.split("/").slice(0, -1).join("/") + "/";
  const fileName = pathWithFileName.split("/").slice(-1)[0];


  const localPathDir = localPathOut + path;

  await fsPromises.mkdir(localPathDir, {
    recursive: true,
  });


  try {
    const contentRead = await fsPromises.readFile(itemInputData, "utf-8");
    const content = (contentRead);
    const input = `${promptBase}\n${content} `;
    let response = await ollama({
      content: input,
      model: "llama3"
    });

    if (!response) return;

    const codes = extractCodeBlocks(response);

    for (let i = 0; i < codes.length; i++) {
      const localPathFileName = localPathOut + path + i + fileName;
      const exist = await checkFileExists(localPathFileName);
      if (exist === true) {
        return;
      }
      const code = codes[i];
      fsPromises.writeFile(
        localPathFileName,
        extractCodeFromTripleBackticks(code),
        "utf-8"
      );
    }

  } catch (error) {
    console.error("error: ", error);
  }

  const min = Math.floor((Date.now() - time) / 1000 / 60);
  const seg = Math.floor((Date.now() - time) / 1000) % 60;
  console.log("  >>>>> end time: ", min, "min", seg, "seg");
  console.log("---------");
}