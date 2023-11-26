export type Message = {
  role: "user" | "system";
  content: string;
};

export type Options = {
  model: string;
  maxTokens: number;
  json: boolean;
};

export interface LLM {
  complete(
    messages: Message[],
    options?: Partial<Options>
  ): Promise<{ content?: string; usage?: [number, number] }>;
  countTokens(messages: Message[]): Promise<number>;
}
