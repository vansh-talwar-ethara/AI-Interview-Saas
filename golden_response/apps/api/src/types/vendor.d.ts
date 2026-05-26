declare module "sanitize-html" {
  const sanitizeHtml: (input: string, options?: Record<string, unknown>) => string;
  export default sanitizeHtml;
}

declare module "pdf-parse" {
  const pdfParse: (buffer: Buffer) => Promise<{ text: string }>;
  export default pdfParse;
}
