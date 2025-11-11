import { cacheKeys, redis } from "@/lib/redis";
import { GeneratedImage, ImageBuffer } from "@/lib/types/i2i-image.t";
import crypto from "node:crypto";
import { I2IImageRepository } from "./i2i-image-repository";

export class I2IImageService {
  private readonly i2iRepository: I2IImageRepository;

  constructor() {
    this.i2iRepository = new I2IImageRepository();
  }

  async generateSymbolI2I(
    symbol: string,
    locale: "ko" | "en"
  ): Promise<GeneratedImage> {
    const base = await this.i2iRepository.fetchBaseImageViaHttp(locale);
    const bytes = base.buffer;
    const baseName = base.baseName;

    // Cache key: sha1(baseImageBytes + '|' + symbol)
    const key = sha1(
      Buffer.concat([
        bytes,
        Buffer.from("|"),
        Buffer.from(symbol.toUpperCase()),
      ])
    );

    const cached = await getI2IImage(key);

    if (cached && cached.base64) {
      return {
        buffer: Buffer.from(cached.base64, "base64"),
        mimeType: cached.mimeType,
        baseName: baseName,
        sourcePath: base.sourcePath,
      };
    }

    let prompt = "";

    if (locale === "en") {
      prompt = buildPromptForEnglishImage(symbol);
    } else {
      prompt = buildPromptForKoreanImage(symbol);
    }

    const imageBuffer = await this.i2iRepository.requestI2IImage(prompt, base);

    await this.i2iRepository.setI2IImage(key, imageBuffer);

    return {
      buffer: Buffer.from(imageBuffer.base64, "base64"),
      mimeType: imageBuffer.mimeType,
      baseName: baseName,
      sourcePath: base.sourcePath,
    };
  }
}

function sha1(data: Buffer | string) {
  const h = crypto.createHash("sha1");
  h.update(data);
  return h.digest("hex");
}

export async function getI2IImage(hash: string): Promise<ImageBuffer | null> {
  const key = cacheKeys.i2iImage(hash);
  const data = await redis.get(key);
  if (!data) return null;
  if (
    typeof data === "object" &&
    data &&
    (data as ImageBuffer).base64 &&
    (data as ImageBuffer).mimeType
  ) {
    return data as ImageBuffer;
  }
  try {
    return JSON.parse(String(data)) as ImageBuffer;
  } catch {
    return null;
  }
}

function buildPromptForKoreanImage(newText: string): string {
  const t = String(newText || "").trim();
  const NEW_TEXT = t.toUpperCase();
  return [
    "[Editing Task]",
    "- In the attached base image, replace the text 'SOL' with '{NEW_TEXT}'.",
    "- Keep all other design elements, colors, textures, and layout exactly the same.",
    "- Preserve the original font, outline, shadow, gradient, and texture effects.",
    "- Keep text alignment, spacing, thickness, and position identical to the original.",
    "- Maintain the same bounding box for the text area; if the new word is longer or shorter, automatically adjust font size to fit without overflow.",
    "- Do not modify the person, Korean text, background, or any other visual element.",
    "- Output image resolution must remain identical to the input.",
  ]
    .join("\n")
    .replace("{NEW_TEXT}", NEW_TEXT);
}

function buildPromptForEnglishImage(newText: string): string {
  const t = String(newText || "").trim();
  const NEW_TEXT = t.toUpperCase();
  return [
    "[Editing Task]",
    "- In the attached base image, replace the text 'SOL' with '{NEW_TEXT}'.",
    "- Keep all other design elements, colors, textures, and layout exactly the same.",
    "- Preserve the original font, outline, shadow, gradient, and texture effects.",
    "- Keep text alignment, spacing, thickness, and position identical to the original.",
    "- Maintain the same bounding box for the text area; if the new word is longer or shorter, automatically adjust font size to fit without overflow.",
    "- Do not modify the person, text, background, or any other visual element'.",
    "- Output image resolution must remain identical to the input.",
  ]
    .join("\n")
    .replace("{NEW_TEXT}", NEW_TEXT);
}
