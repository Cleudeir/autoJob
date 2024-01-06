import OpenAI from "openai";

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
    baseURL: "http://localhost:1234/v1",
  });

  console.log("chatCompletion: ");
  const chatCompletion = await openai.chat.completions.create({
    model: `gpt-3.5-turbo`,
    messages: [
      {
        role: "system",
        content: "you are best programming development assistant",
      },
      {
        role: "user",
        content: `response my ask with only code, not explain :  ${prompt}`,
      },
    ],
  });

  const [_, result]: any =
    chatCompletion.choices[0].message.content?.split("```");
  console.log("result: ", String(result));

  return String(result);
};
