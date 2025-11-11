export type GeneratedImage = {
  buffer: Buffer;
  mimeType: string;
  baseName: string;
  sourcePath: string;
};

export type ImageBuffer = {
  base64: string;
  mimeType: string;
};

export interface GoogleGenerativeAIResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        inlineData?: {
          mimeType?: string;
          data?: string;
        };
      }>;
    };
  }>;
}
