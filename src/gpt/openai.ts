const fetch = (...args: any[]) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
import { OPENAI_API_KEY } from "../../.env.js";

type Props = {
  content: string;
  model?: string;
  maxTokens?: number;
  temperature?: number;
  type?: number;
  server?: "lmStudio" | "ollama" | "openai";
};



export const openai = async ({
  content,
}: Props): Promise<string | undefined> => {
  const time = Date.now();

  const url = "https://api.openai.com/v1/completions";
  const prompt = `${content}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        prompt,
        model: "text-davinci-003",
        temperature: 0.7,
        max_tokens: 300,
      }),
    });

    const result = await response.json();

    const min = Math.floor((Date.now() - time) / 1000 / 60);
    const seg = Math.floor((Date.now() - time) / 1000) % 60;
    console.log("end time: ", min, "min", seg, "seg");

    return result.choices[0].text.trim();
  } catch (error) {
    console.error("Error fetching response:", error);
    return undefined;
  }
};
