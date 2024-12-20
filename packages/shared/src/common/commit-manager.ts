import type { DiffResult } from "simple-git"
import { SETTING_MODEL_ID } from "./app"
import type { IConfig, ILogger, IProviderManager } from "./core"
import type { BaseGenerateCommitProvider, GenerateCommitOptions } from "./generate-commit"

export interface CommitManagerContext {
  config: IConfig
  logger: ILogger
  providersManager: IProviderManager
}

export interface CommitManagerAdapter {
  createConfig(): IConfig

  createLogger(): ILogger

  createProvidersManager(): IProviderManager
}

export type Status = "pending" | "running" | "success" | "error"

export class CommitManager {
  public providers: BaseGenerateCommitProvider[] = []
  public context: CommitManagerContext
  public status: {
    loadingProviders: Status
  } = {
    loadingProviders: "pending",
  }

  constructor(context: CommitManagerContext) {
    this.context = context
    this.context.providersManager
      .init()
      .then(providers => {
        this.providers = providers
        this.context.logger.info(`Loaded ${providers.length} providers`)
        this.status.loadingProviders = "success"
      })
      .catch(error => {
        this.context.logger.error(`Failed to load providers: ${error}`)
        this.status.loadingProviders = "error"
      })
  }

  static create(adapter: CommitManagerAdapter) {
    return new CommitManager({
      config: adapter.createConfig(),
      providersManager: adapter.createProvidersManager(),
      logger: adapter.createLogger(),
    })
  }

  // public initProviders(): void

  private async update(key: string, value: any) {
    try {
      await this.context.config.update(key, value, true)
      return true
    } catch (error) {
      return false
    }
  }

  get models() {
    return this.providers.flatMap(p => p.models)
  }

  get modelId() {
    return this.context.config.get<string>(SETTING_MODEL_ID)
  }

  get model() {
    const model = this.models.find(model => model.id === this.modelId)
    if (!model) this.context.logger.error(`Model ${this.modelId} not found`)
    return model
  }

  get provider() {
    return this.providers.find(p => p.models.some(model => model.id === this.modelId))
  }

  get options(): GenerateCommitOptions {
    return {
      lang: this.context.config.get("lang"),
    }
  }

  public async selectModel(modelId: string): Promise<boolean> {
    return await this.update(SETTING_MODEL_ID, modelId)
  }

  public async generateCommit(diff: DiffResult) {
    const model = this.model
    if (!model) throw new Error("No model selected")

    const provider = this.provider
    if (!provider) throw new Error(`Provider ${this.model.providerId} not found`)

    const options = this.options
    return provider.generateCommit({ model, diff, options })
  }
}
