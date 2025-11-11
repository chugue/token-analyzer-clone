import { CONFIG } from "@/config";
import { cacheKeys, redis } from "@/lib/redis";
import {
  GeneratedImage,
  GoogleGenerativeAIResponse,
  ImageBuffer,
} from "@/lib/types/i2i-image.t";

export class I2IImageRepository {
  private readonly apiKey: string;
  private readonly model: string;

  constructor() {
    this.apiKey = CONFIG.I2I.GOOGLE_API_KEY || "";
    this.model = CONFIG.I2I.MODEL || "";
  }

  async fetchBaseImageViaHttp(locale: "ko" | "en"): Promise<GeneratedImage> {
    const baseUrl = resolveBaseUrl();

    let paths: string[];

    if (locale === "en") {
      paths = candidatePublicPathsForEnglishImage();
    } else {
      paths = candidatePublicPathsForKoreanImage();
    }

    const pick = pickRandom(paths);
    const url = `${baseUrl}${pick}`;
    const res = await fetch(url, { cache: "no-store" });

    if (!res.ok) {
      throw new Error(`Failed to fetch base image: ${url} (${res.status})`);
    }

    const ct = res.headers.get("content-type") || extToMime(pick);
    const ab = await res.arrayBuffer();

    return {
      buffer: Buffer.from(ab),
      mimeType: ct,
      baseName: baseNameOf(pick),
      sourcePath: pick,
    };
  }

  async requestI2IImage(
    prompt: string,
    base: GeneratedImage
  ): Promise<ImageBuffer> {
    const mimeType = base.mimeType;
    const base64 = base.buffer.toString("base64");

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
        this.model
      )}:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-goog-api-key": this.apiKey,
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                { text: prompt },
                { inlineData: { mimeType, data: base64 } },
              ],
            },
          ],
        }),
      }
    );

    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      throw new Error(`I2I upstream error ${res.status}: ${detail}`);
    }

    const json = (await res.json()) as GoogleGenerativeAIResponse;
    const parts = json?.candidates?.[0]?.content?.parts ?? [];
    const imagePart = parts.find((p) => p?.inlineData?.data);

    if (!imagePart?.inlineData?.data) {
      throw new Error("I2I response did not inclue an image");
    }

    const outMime = imagePart.inlineData.mimeType || mimeType;
    const outBase64 = imagePart.inlineData.data as string;

    return { base64: outBase64, mimeType: outMime };
  }

  async setI2IImage(
    hash: string,
    payload: { base64: string; mimeType: string }
  ) {
    const key = cacheKeys.i2iImage(hash);
    const serialized = JSON.stringify(payload);
    await redis.setex(key, CONFIG.CACHE_TTL.I2I_IMAGE, serialized);
  }
}

function resolveBaseUrl(): string {
  // Internal base URL must come from env (or Vercel URL pre-computed in config)
  const internal = CONFIG.APP.INTERNAL_BASE_URL as string | undefined;
  if (internal && internal.trim()) return internal.replace(/\/$/, "");
  throw new Error("INTERNAL_BASE_URL is required for I2I base image fetching");
}

function candidatePublicPathsForEnglishImage(): string[] {
  // 리포지토리에 포함된 기본 베이스 이미지 경로(정적 자산)
  return ["/i2i/en/1.png", "/i2i/en/2.png", "/i2i/en/3.png"];
}

function candidatePublicPathsForKoreanImage(): string[] {
  // 리포지토리에 포함된 기본 베이스 이미지 경로(정적 자산)
  return ["/i2i/base/1.png", "/i2i/base/2.png", "/i2i/base/3.png"];
}

function pickRandom<T>(arr: T[]): T {
  if (!arr.length) throw new Error("No base images configured");
  const idx = Math.floor(Math.random() * arr.length);
  return arr[idx];
}

function extToMime(p: string) {
  const low = p.toLowerCase();
  if (low.endsWith(".png")) return "image/png";
  if (low.endsWith(".jpg") || low.endsWith(".jpeg")) return "image/jpeg";
  if (low.endsWith(".webp")) return "image/webp";
  return "application/octet-stream";
}

function baseNameOf(p: string): string {
  const idx = p.lastIndexOf("/");
  return idx >= 0 ? p.slice(idx + 1) : p;
}
