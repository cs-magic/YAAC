export interface SolutionMetrics {
  accuracy?: number;
  speed?: number;
  cost?: number;
  // 可以根据需要添加更多指标
}

export interface ValidationResult {
  valid: boolean;
  error?: string;
  // 如果验证失败，可能需要的配置项
  requiredConfig?: {
    key: string; // 配置项的键
    description: string; // 配置项的描述
    type: "string" | "boolean" | "number"; // 配置项的类型
    settingPath?: string; // VSCode 设置中的路径（如果适用）
  }[];
}

export interface Solution {
  id: string; // 全局唯一的解决方案ID
  name: string; // 显示名称
  description: string; // 描述
  providerId: string; // 提供者ID
  metrics: SolutionMetrics;

  // 验证 solution 是否满足使用条件
  validate(): Promise<ValidationResult>;
}

export interface CommitGenerationResult {
  message: string;
  error?: string;
}

export interface Provider {
  id: string; // 提供者ID
  name: string; // 提供者名称
  description: string; // 提供者描述
  enabled: boolean; // 是否启用
  solutions: Solution[];

  generateCommit(
    diff: string,
    solution: Solution
  ): Promise<CommitGenerationResult>;
}