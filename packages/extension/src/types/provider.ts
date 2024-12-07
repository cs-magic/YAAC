import { Model } from "@/types/model";

export const presetAiProviders = [
  "openai",
  "anthropic",
  "deepseek",
  "zhipu",
  "groq",
];

export interface CommitGenerationResult {
  message: string;
  error?: string;
}

export interface Provider {
  id: string; // 提供者ID
  name: string; // 提供者名称
  description: string; // 提供者描述
  enabled: boolean; // 是否启用
  models: Model[];

  generateCommit(diff: string, model: Model): Promise<CommitGenerationResult>;
}
