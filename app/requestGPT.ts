import OpenAI from "openai";
import { apiKey } from "../.env";

type Props = {
  prompt: string;
  apiKey: string;
  model?: string;
  maxTokens?: number;
  temperature?: number;
};

export const requestGPT = async ({
  prompt,
  apiKey,
  model = "text-davinci-003",
  maxTokens = 100,
  temperature = 0.7,
}: Props) => {
  const openai = new OpenAI({
    apiKey: apiKey,
    //baseURL: "http://localhost:1234/v1",
  });

  const chatCompletion = await openai.chat.completions.create({
    model: `gpt-3.5-turbo`,
    messages: [
      { role: "system", content: "Always answer in rhymes." },
      { role: "user", content: `${prompt}` },
    ],
  });

  const result = chatCompletion.choices[0].message;

  return result;
};
