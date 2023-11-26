import { LLM, Message, Options } from "./LLM.js";
import { OpenAI } from "openai";
import { promptTokensEstimate } from "openai-chat-tokens";

export class OpenAILLM implements LLM {
  private options: Options;
  private openai: OpenAI;

  constructor(apiKey: string, options?: Options) {
    this.options = {
      model: "gpt-3.5-turbo-1106",
      maxTokens: 1000,
      json: false,
      ...options,
    };
    this.openai = new OpenAI({
      apiKey,
    });
  }

  async complete(
    messages: Message[],
    extraOptions?: Partial<Options>
  ): Promise<{ content?: string; usage?: [number, number] }> {
    const options = { ...this.options, ...extraOptions };
    const response = await this.openai.chat.completions.create({
      model: options.model,
      messages,
      max_tokens: options.maxTokens,
      response_format: { type: options.json ? "json_object" : "text" },
    });

    const {
      usage,
      choices: [
        {
          message: { content },
        },
      ],
    } = response;
    return {
      usage: usage ? [usage.prompt_tokens, usage.completion_tokens] : undefined,
      content: content ?? undefined,
    };
  }

  async countTokens(messages: Message[]): Promise<number> {
    return promptTokensEstimate({
      messages,
    });
  }
}
