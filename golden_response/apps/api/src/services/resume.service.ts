import mammoth from "mammoth";
import pdfParse from "pdf-parse";
import type { Express } from "express";

export async function extractResumeText(fileBuffer: Buffer, fileName: string) {
  if (fileName.toLowerCase().endsWith(".docx")) {
    const result = await mammoth.extractRawText({ buffer: fileBuffer });
    return result.value;
  }

  const result = await pdfParse(fileBuffer);
  return result.text;
}

export function deriveResumeInsights(rawText: string) {
  const lower = rawText.toLowerCase();
  const technologies = ["react", "node", "express", "mongodb", "redis", "typescript", "python", "java"].filter((technology) => lower.includes(technology));
  const projects = Array.from(rawText.matchAll(/(?:project|built|led)[:\-\s]+(.+?)(?:\.|\n|$)/gi)).map((match) => match[1].trim()).slice(0, 5);
  return { technologies, projects, extractedSkills: technologies, experienceMonths: 36 };
}
