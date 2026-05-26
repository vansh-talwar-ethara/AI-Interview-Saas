export async function evaluateCodeSubmission(input: { sourceCode: string; language: string }) {
  const hasMain = /main\s*\(/.test(input.sourceCode);
  return {
    judge0Result: { stdout: hasMain ? "OK" : "", stderr: hasMain ? "" : "Missing entry point", time: 0.1 },
    aiEvaluation: {
      correctness: hasMain ? 75 : 30,
      timeComplexity: "O(n)",
      spaceComplexity: "O(1)",
      readability: 72,
      hint: "Focus on clarifying the base case and edge conditions before optimizing further.",
    },
  };
}
