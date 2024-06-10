export function extractCodeBlocks(markdown: string) {
    const codeBlocks: string[] = [];
    const matches = markdown.match(/```[^`]*```/g);

    if (matches) {
        matches.forEach(block => {
            const code = block;
            codeBlocks.push(code);
        });
    }

    return codeBlocks;
}