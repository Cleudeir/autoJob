const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

type Props = {
  prompt: string;
  apiKey: string;
  model?:
    | "llama2"
    | "gemma:7b"
    | "deepseek-coder"
    | "deepseek-coder:6.7b"
    | "deepseek-coder:33b"
    | "deepseek-coder:1.3b-base";
  maxTokens?: number;
  temperature?: number;
  type?: number;
};

export const requestGPT = async ({
  prompt,
  apiKey,
  model = "llama2",
  maxTokens = 100,
  temperature = 0.7,
  type = 0,
}: Props): Promise<string | null> => {
  const url = "http://localhost:11434/api/generate";
  const prompType = [
    `\nResume this and response-me only in this structure, json format, kardown code:\n`,
    `\nFix indentation, the code and response-me only in this structure, json format, kardown code:\n`,
  ];
  const requestBody1 = {
    model,
    prompt: `${prompt}
    ${prompType[type]}
    { 
      name: " ",
      libs: " ",
      input: (component inputs with types): " ",
      output: (component output with types, if return JSX.Element list all tags names and your attributes): " "
    }
  `,
    stream: false,
  };

  try {
    console.log("start");
    const time = Date.now();

    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify(requestBody1),
    });

    const result = await response.json();
    const { response: output } = result;

    console.log("end", Date.now() - time);
    console.log(result);
    return output;
  } catch (error) {
    console.error("Error fetching response:", error);
    return null;
  }
};
