import { GEMINI_API_KEY } from '../../.env';
import { extractCodeFromTripleBackticks } from '../utils/extractCodeFromTripleBackticks';

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
    console.log('responseData: ', JSON.stringify(responseData, null, 2));

    if (!responseData) return
    const parsedResponse = responseData.candidates[0].content.parts[0].text;
    console.log('parsedResponse: ', JSON.stringify(parsedResponse, null, 2));
    return parsedResponse;
  } catch (error) {
    console.error("Error fetching response:", error);
    return undefined;
  }
};
