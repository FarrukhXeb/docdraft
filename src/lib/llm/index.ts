import type { LLMProvider } from "./types";
import { GroqProvider } from "./groq";

export type { LLMProvider, LLMMessage, DraftOptions, DraftResult } from "./types";

/**
 * Provider registry. The active provider is chosen by the LLM_PROVIDER env var
 * alone; the rest of the app calls `getLLMProvider()` and never names a vendor.
 *
 * To add Anthropic or Bedrock later:
 *   1. Implement `LLMProvider` in ./anthropic.ts (or ./bedrock.ts).
 *   2. Add a `case` below that constructs it from env vars.
 *   3. Set LLM_PROVIDER in .env.local. No other code changes.
 */
export function getLLMProvider(): LLMProvider {
  const which = (process.env.LLM_PROVIDER ?? "groq").toLowerCase();

  switch (which) {
    case "groq":
      return new GroqProvider({
        apiKey: process.env.GROQ_API_KEY ?? "",
        model: process.env.GROQ_MODEL ?? "llama-3.3-70b-versatile",
        baseUrl: process.env.GROQ_BASE_URL,
      });

    // case "anthropic":
    //   return new AnthropicProvider({
    //     apiKey: process.env.ANTHROPIC_API_KEY ?? "",
    //     model: process.env.ANTHROPIC_MODEL ?? "claude-3-5-sonnet-latest",
    //   });

    // case "bedrock":
    //   return new BedrockProvider({ ...fromEnv });

    default:
      throw new Error(
        `Unknown LLM_PROVIDER "${which}". Supported: groq. ` +
          `See src/lib/llm/index.ts to register more.`
      );
  }
}
