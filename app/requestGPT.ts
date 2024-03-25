const fetch = (...args: any[]) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
import { apiKey } from "../.env.ts";

type Props = {
  content: string;
  model?:
    | "codellama"
    | "codellama:13b"
    | "llama2"
    | "deepseek-coder"
    | "gemma:7b"
    | "gemma:2b"
    | "deepseek-coder:6.7b"
    | "deepseek-coder:33b"
    | "deepseek-coder:1.3b-base"
    | "mixtral"
    | "mistral";
  maxTokens?: number;
  temperature?: number;
  type?: number;
  server?: "lmStudio" | "ollama" | "openai";
};

function extractCodeFromTripleBackticks(inputString: string) {
  const regex = /```(?:json|jsx|tsx|javascript|typescript)?\n((?:.|\n)*?)```/g;
  let result = "";
  let match;

  while ((match = regex.exec(inputString)) !== null) {
    result += match[1];
  }
  return result;
}

export const requestGPT = async ({
  content,
  model = "mistral",
  server = "ollama",
}: Props): Promise<string | undefined> => {
  const time = Date.now();

  if (server === "ollama") {
    const url = "http://localhost:11434/api/generate";
    const body = {
      model,
      prompt: `${content}`,
      stream: false,
      options: {
        num_batch: 2,
        num_gqa: 1,
        num_gpu: 32,
        main_gpu: 1,
        num_thread: 4,
      },
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(body),
      });

      const result = await response.json();
      const { response: output } = result;

      return extractCodeFromTripleBackticks(output);
    } catch (error) {
      console.error("Error fetching response:", error);
      return undefined;
    }
  } else if (server === "lmStudio") {
    const url = "http://localhost:1234/v1/completions";
    const body = {
      prompt: `${content}`,
      temperature: 0.7,
      stream: false,
      max_tokens: -1,
    };
    try {
      console.log("start");
      const time = Date.now();
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      const result = await response.json();
      const { response: output } = result;
      return output;
    } catch (error) {
      console.error("Error fetching response:", error);
      return undefined;
    }
  } else if (server === "openai") {
    const url = "https://api.openai.com/v1/completions";
    const prompt = `${content}`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          prompt,
          model: "text-davinci-003", // Adjust model name if necessary
          temperature: 0.7,
          max_tokens: 300, // Adjust based on your requirements
        }),
      });

      const result = await response.json();
      return result.choices[0].text.trim();
    } catch (error) {
      console.error("Error fetching response:", error);
      return undefined;
    }
  }

  const min = Math.floor((Date.now() - time) / 1000 / 60);
  const seg = Math.floor((Date.now() - time) / 1000) % 60;
  console.log("end time: ", min, "min", seg, "seg");
};
