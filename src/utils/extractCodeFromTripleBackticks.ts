export function extractCodeFromTripleBackticks(inputString: string) {
  const regex = /```(javascript|jsx|typescript|tsx|ts|json|\n)([\s\S]+?)```/g;
  let result = "";
  let match;

  while ((match = regex.exec(inputString)) !== null) {
    result += match[2];
  }
  if (result === "") {
    result = inputString;
  }
  return result;
}