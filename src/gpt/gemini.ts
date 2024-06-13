import { GEMINI_API_KEY } from '../../.env';

type Props = {
  content: string;
  model?: string;
};

export const gemini = async ({ content, model = 'gemini-pro' }: Props) => {
  const contents = [
    {
      role: 'user',
      parts: [
        {
          text: `${content}`,
        },
      ],
    },
  ];
  const generationConfig = {
    temperature: 0.9,
    topK: 0,
    topP: 1,
    maxOutputTokens: 2048,
    stopSequences: [],
  };
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents,
          generationConfig,
        }),
      },
    );

    const responseData = await response.json();
    if (!responseData) return
    const parsedResponse = responseData.candidates[0].content.parts[0].text;
    return parsedResponse;
  } catch (error) {
    console.error("Error fetching response:", error);
    return undefined;
  }
};
