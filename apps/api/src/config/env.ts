import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
import { z } from "zod";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load .env from root of api app
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const envSchema = z.object({
  PORT: z.coerce.number().default(4000),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  SUPABASE_URL: z.string().url("Invalid SUPABASE_URL"),
  SUPABASE_SECRET_KEY: z.string().startsWith("sb_secret_", "Secret key must start with sb_secret_"),
  JWT_SECRET: z.string().min(1, "JWT_SECRET is required"),
  CORS_ORIGINS: z.preprocess(
    (val) => {
      if (typeof val === "string") return val.split(",");
      if (Array.isArray(val)) return val;
      return undefined;
    },
    z.array(z.string()).default(["http://localhost:3000", "http://localhost:3001"])
  ),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Invalid API environment configuration:\n", JSON.stringify(parsed.error.format(), null, 2));
  process.exit(1);
}

export const env = {
  ...parsed.data,
  isDev: parsed.data.NODE_ENV === "development",
  isProd: parsed.data.NODE_ENV === "production",
} as const;
