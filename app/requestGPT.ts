const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

type Props = {
  content: string;
  model?:
    | "llama2"
    | "gemma:7b"
    | "deepseek-coder:6.7b"
    | "deepseek-coder:33b"
    | "deepseek-coder:1.3b-base"
    | "mixtral";
  maxTokens?: number;
  temperature?: number;
  type?: number;
  sever?: "lmStudio" | "ollama";
};

export const requestGPT = async ({
  content,
  model = "llama2",
  type = 0,
  sever = "ollama",
}: Props): Promise<string | null> => {
  const prompType = [
    `\nResponse-me only in this structure, json format, kardown code:\n
    { 
      "name": "",
      "libs": "",
      "input" (component inputs with types): "",
      "output" (component output with types, if output is JSX.Element list all tags names and your attributes): ""
    }
    `,
    `\nVerify json format, fix Property keys must be doublequoted, fix indentation, remover all comments, fix kardown code:\n
    { 
      "name": "",
      "libs": "",
      "input": "",
      "output": ""
    }
    `,
  ];

  if (sever === "ollama") {
    const url = "http://localhost:11434/api/generate";

    const body = {
      model,
      prompt: `${content}
      ${prompType[type]}
    `,
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
      console.log("start", type);
      const time = Date.now();
      const response = await fetch(url, {
        method: "POST",
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
      return null;
    }
  } else if (sever === "lmStudio") {
    const url = "http://localhost:1234/v1/completions";

    const body = {
      prompt: `${content}
      ${prompType[type]}     
    `,
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

      const min = Math.floor((Date.now() - time) / 1000 / 60);
      const seg = Math.floor((Date.now() - time) / 1000) % 60;
      console.log("end time: ", min, "min", seg, "seg");

      return output;
    } catch (error) {
      console.error("Error fetching response:", error);
      return null;
    }
  } else {
    return null;
  }
};
