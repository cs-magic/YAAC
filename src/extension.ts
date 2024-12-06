import * as vscode from "vscode";
import { AppManager } from "./core";

/**
 * @description
 * @author
 * @date 2023-02-20 14:30:00
 * @export
 */
export async function activate(context: vscode.ExtensionContext) {
  console.log("YAAC is now active!");

  try {
    const app = new AppManager(context);
    await app.initialize();

    context.subscriptions.push({ dispose: () => app.dispose() });
  } catch (error: unknown) {
    console.error("Failed to initialize YAAC:", error);
    const message =
      error instanceof Error ? error.message : "Unknown error occurred";
    vscode.window.showErrorMessage(`Failed to initialize YAAC: ${message}`);
  }
}

export function deactivate() {
  console.log("YAAC is now deactivated");
}
