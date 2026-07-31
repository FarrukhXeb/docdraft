import type {
  DraftOptions,
  DraftResult,
  LLMMessage,
  LLMProvider,
} from "./types";

/**
 * Groq provider, talking to Groq's OpenAI-compatible Chat Completions API.
 * Because the wire format is the OpenAI schema, an OpenAI provider would be a
 * near-identical copy with a different base URL.
 */
export class GroqProvider implements LLMProvider {
  readonly name = "groq";
  readonly model: string;
  private readonly apiKey: string;
  private readonly baseUrl: string;

  constructor(config: { apiKey: string; model: string; baseUrl?: string }) {
    if (!config.apiKey) {
      throw new Error(
        "GROQ_API_KEY is not set. Add it to .env.local (see .env.example)."
      );
    }
    this.apiKey = config.apiKey;
    this.model = config.model;
    this.baseUrl = config.baseUrl ?? "https://api.groq.com/openai/v1";
  }

  async draft(
    messages: LLMMessage[],
    opts: DraftOptions = {}
  ): Promise<DraftResult> {
    const body: Record<string, unknown> = {
      model: this.model,
      messages,
      temperature: opts.temperature ?? 0.3,
      max_tokens: opts.maxTokens ?? 1024,
    };
    if (opts.json) {
      body.response_format = { type: "json_object" };
    }

    let res: Response;
    try {
      res = await fetch(`${this.baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify(body),
      });
    } catch (err) {
      throw new Error(
        `Groq request failed (network): ${(err as Error).message}`
      );
    }

    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      throw new Error(
        `Groq API error ${res.status} ${res.statusText}: ${detail.slice(0, 500)}`
      );
    }

    const data = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const text = data.choices?.[0]?.message?.content ?? "";
    if (!text) {
      throw new Error("Groq returned an empty completion.");
    }

    return { text, model: this.model, provider: this.name };
  }
}
