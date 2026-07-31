/**
 * Provider-agnostic LLM interface.
 *
 * No application code should know which concrete provider is active. To add a
 * new backend (Anthropic, AWS Bedrock, ...), implement `LLMProvider` in a new
 * file and register it in `./index.ts`. Nothing else changes.
 */

export interface LLMMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface DraftOptions {
  /** Sampling temperature. Lower = more deterministic. */
  temperature?: number;
  /** Hard cap on output tokens. */
  maxTokens?: number;
  /**
   * When provided, the provider is asked to return JSON that conforms to this
   * JSON-schema-like description. Providers that support structured output use
   * it; others fall back to prompt instructions + best-effort parsing.
   */
  json?: boolean;
}

export interface DraftResult {
  /** The raw text the model produced. */
  text: string;
  /** Provider + model that produced this result, for display/debugging. */
  model: string;
  provider: string;
}

export interface LLMProvider {
  /** Stable identifier, e.g. "groq". */
  readonly name: string;
  /** The model this instance targets, e.g. "llama-3.3-70b-versatile". */
  readonly model: string;
  /**
   * Produce a completion for the given messages. Implementations must throw a
   * descriptive Error on failure (network, auth, rate-limit, bad request).
   */
  draft(messages: LLMMessage[], opts?: DraftOptions): Promise<DraftResult>;
}
