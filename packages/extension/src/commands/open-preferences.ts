import type { VscodeCommand } from "@/vscode-command"
import { APP_ID_CAMEL, COMMAND_OPEN_PREFERENCE } from "@shared/common"
import vscode from "vscode"

export class OpenPreferencesCommand implements VscodeCommand {
  public id = COMMAND_OPEN_PREFERENCE

  async execute(): Promise<void> {
    console.log("Open preferences command triggered")

    await vscode.commands.executeCommand("workbench.action.openSettings", APP_ID_CAMEL)
  }
}
