import { atomWithVSCodeStorage } from "./with-vscode-storage";

export type ViewMode = "plain" | "split" | "preview";

// 编辑器视图模式 - 使用 VSCode 存储
export const descriptionViewModeAtom = atomWithVSCodeStorage<ViewMode>(
  "commit_description_view_mode",
  "split"
);

// 后续可以添加更多用户偏好设置
// export const otherPreferenceAtom = atomWithVSCodeStorage("key", defaultValue);