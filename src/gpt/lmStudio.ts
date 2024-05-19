import { LM_STUDIO_URL } from "../../.env";

const fetch = (...args: any[]) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

type Props = {
  content: string;
  model?: string;
};

export const lmStudio = async ({
  content,
}: Props): Promise<string | undefined> => {
  const time = Date.now();

  const url = LM_STUDIO_URL + "/v1/completions";
  const body = {
    prompt: `${content}`,
    temperature: 0.7,
    stream: false,
    max_tokens: -1,
  };

  try {
    console.log("start");    
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const result = await response.json();
    const { response: output } = result;

    const min = Math.floor((Date.now() - time) / 1000 / 60);
    const seg = Math.floor((Date.now() - time) / 1000) % 60;
    console.log("end time: ", min, "min", seg, "seg");

    return output;
  } catch (error) {
    console.error("Error fetching response:", error);
    return undefined;
  }

};
