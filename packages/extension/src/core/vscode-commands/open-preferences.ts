import { VscodeCommand } from "@/core/vscode-commands/types";
import { openPreferences } from "@/utils/open-preference";

export class OpenPreferencesCommand implements VscodeCommand {
  public id = "yaac.openPreferences";

  async execute(): Promise<void> {
    console.log("Open preferences command triggered");

    await openPreferences();
  }
}
