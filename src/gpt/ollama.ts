import { OLLAMA_URL } from "../../.env";

const fetch = (...args: any[]) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));


type Props = {
  content: string;
  model?: string;
};

export const ollama = async ({
  content,
  model = "phi3:14b-medium-128k-instruct-q3_K_M" || 'phi3' || 'llama3',
}: Props): Promise<string | undefined> => {
  const time = Date.now();

  const url = OLLAMA_URL + "/api/generate";
  const body = {
    model,
    prompt: `${content}`,
    stream: false,
    options: {
      main_gpu: 1,
      // num_batch: 4,
      // num_gqa: 4,
      // num_gpu: 48,
      // num_thread: 4,
    },
  };

  const timeMax = (ms = 60 * 1 * 1000) =>
    new Promise((resolve, reject) => {
      return setTimeout(() => resolve({ json: () => Promise.resolve({ error: "timeout 60s" }) }), ms)
    })

  try {
    const response = await Promise.race([
      fetch(url, {
        method: "POST",
        body: JSON.stringify(body),
      }),
      timeMax(),
    ])


    const result = await response?.json();
    if (result.error) {
      console.error("Error fetching response:", result.error);
      return undefined;
    }

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
