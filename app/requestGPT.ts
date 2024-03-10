const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

type Props = {
  content: string;
  model?:
    | "codellama:7b"
    | "codellama:13b"
    | "llama2"
    | "deepseek-coder"
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
  model = "codellama:7b",
  type = 0,
  sever = "ollama",
}: Props): Promise<string | null> => {
  const prompType = [
    `
    this code is react native TypeScrept, refactory this code using this instructions:
    1. Remove code repeat create function to do not repeat code
    2. Remove all comments
    3. Retype this code, this is typescript code, fix types "any",
    4. Rename all variables to portuguese pt-br
    5. Write complete code
    6. Response complete code
    7. write only code, no comment, no explanation, no other information
    `,
    `
    \nto be succinct json format with summary: 
    {
      "libs": string[] ,
     "name" (obs.: exported function name): string,
     "input": { [name: string]: type },
     "variables inside function": { [name: string]: type },
     "useState": { [name: string]: type },
     "component React": list all,
     "explain" (explain to do): string,
     "business rule" : string,
     "styles" : string[],
    }
    use types to resume, return only json
    `,
    `
    this code is react native TypeScrept, refactory this code using this instructions:
    1. Remove code repeat create function to do not repeat code
    2. Remove all comments
    3. Retype this code, this is typescript code, fix types "any",
    4. Rename all variables to portuguese pt-br
    5. Write complete code
    6. Response complete code
    7. write only code, no comment, no explanation, no other information
    `,
    `
    Create a new component React native based on this code, use only this code, no explanation, no other information, typescript code, code format
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
        num_gpu: 16,
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
