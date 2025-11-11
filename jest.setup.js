import { config } from "dotenv";
import { resolve } from "path";

// .env.local 파일 로드
config({ path: resolve(__dirname, ".env.local") });
