import React, { useMemo } from "react";
import { useAtom } from "jotai";
import { selectedFileAtom } from "../../state/atoms/commit-ui";
import { commitFilesAtom } from "../../state/atoms/commit-core";
import { selectFileAtom } from "../../state/atoms/commit-ui";
import { searchQueryAtom } from "../../state/atoms/commit-ui";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { VSCodeButton } from "@vscode/webview-ui-toolkit/react";
import { cn } from "../../lib/utils";
import { HighlightCode } from "../common/HighlightCode";

interface DiffLineProps {
  content: string;
  type: "addition" | "deletion" | "context";
  lineNumber: number;
}

const DiffLine: React.FC<DiffLineProps> = ({ content, type, lineNumber }) => (
  <div className={cn("diff-line", type)}>
    <span className="line-number">{lineNumber}</span>
    <span className="line-content">{content}</span>
  </div>
);

export const DiffViewer: React.FC = () => {
  const [selectedPath] = useAtom(selectedFileAtom);
  const [files] = useAtom(commitFilesAtom);
  const [, selectFile] = useAtom(selectFileAtom);
  const [searchQuery] = useAtom(searchQueryAtom);

  const selectedFile = files.find((f) => f.path === selectedPath);

  const { language, processedDiff, lineTypes } = useMemo(() => {
    if (!selectedFile?.diff) {
      return { language: "text", processedDiff: "", lineTypes: [] };
    }

    // Detect file language from extension
    const ext = selectedFile.path.split(".").pop()?.toLowerCase() || "text";
    const languageMap: Record<string, string> = {
      ts: "typescript",
      tsx: "typescript",
      js: "javascript",
      jsx: "javascript",
      py: "python",
      // Add more mappings as needed
    };

    // Process diff to add line classes
    const lines = selectedFile.diff.split("\n");
    const processedLines = lines.map((line) => {
      if (line.startsWith("+")) {
        return { line: line.slice(1), type: "addition" };
      } else if (line.startsWith("-")) {
        return { line: line.slice(1), type: "deletion" };
      }
      return { line, type: "context" };
    });

    return {
      language: languageMap[ext] || "text",
      processedDiff: processedLines.map(({ line }) => line).join("\n"),
      lineTypes: processedLines.map(({ type }) => type),
    };
  }, [selectedFile]);

  if (!selectedFile) {
    return (
      <div className="diff-viewer empty">
        <p>Select a file to view changes</p>
      </div>
    );
  }

  const handleClose = () => {
    selectFile("");
  };

  return (
    <div className="grow overflow-hidden h-full flex flex-col">
      <div className="flex-none h-[35px] flex items-center justify-between pl-[20px] pr-2 select-none border-b border-vscode-panel-border">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <span className="text-[11px] font-medium uppercase tracking-wide text-vscode-sideBarTitle-foreground">
              Changes
            </span>
            <span className="text-[11px] opacity-80">
              ({selectedFile.path})
            </span>
          </div>
          <div className="flex items-center gap-2 text-[12px] tabular-nums">
            <span
              className="text-vscode-gitDecoration-addedResourceForeground"
              title="Lines added"
            >
              +{selectedFile.additions}
            </span>
            <span
              className="text-vscode-gitDecoration-deletedResourceForeground"
              title="Lines removed"
            >
              -{selectedFile.deletions}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <VSCodeButton
            appearance="icon"
            title="Close diff view"
            onClick={handleClose}
          >
            <span className="codicon codicon-close" />
          </VSCodeButton>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto">
        <HighlightCode
          code={processedDiff || "No changes"}
          language={language}
          highlight={searchQuery}
          lineTypes={lineTypes}
        />
      </div>
    </div>
  );
};
