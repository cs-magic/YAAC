"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildFileTree = buildFileTree;
function createFileNode(file) {
    return {
        name: file.path.split("/").pop() || "",
        path: file.path,
        type: "file",
        displayName: file.path,
        fileInfo: {
            path: file.path,
            size: 0, // Size not available from git change
            type: "file",
            modified: new Date().toISOString(), // Modification time not available from git change
            additions: file.additions,
            deletions: file.deletions,
            status: file.status,
        },
    };
}
function createDirectoryNode(path) {
    return {
        name: path.split("/").pop() || "",
        path,
        type: "directory",
        displayName: path,
        children: [],
    };
}
function buildFileTree(files) {
    const root = createDirectoryNode("");
    root.children = [];
    for (const file of files) {
        const pathParts = file.path.split("/");
        let currentNode = root;
        // Create directory nodes
        for (let i = 0; i < pathParts.length - 1; i++) {
            const pathSoFar = pathParts.slice(0, i + 1).join("/");
            let childNode = currentNode.children?.find(child => child.type === "directory" && child.path === pathSoFar);
            if (!childNode) {
                childNode = createDirectoryNode(pathSoFar);
                currentNode.children = currentNode.children || [];
                currentNode.children.push(childNode);
            }
            currentNode = childNode;
        }
        // Add file node
        currentNode.children = currentNode.children || [];
        currentNode.children.push(createFileNode(file));
    }
    // Sort nodes by displayName
    const sortNodes = (nodes) => {
        return nodes.sort((a, b) => {
            // Directories come before files
            if (a.type !== b.type) {
                return a.type === "directory" ? -1 : 1;
            }
            // Sort by displayName within same type
            return (a.displayName || "").localeCompare(b.displayName || "");
        });
    };
    // Recursively sort all nodes
    const sortTreeNodes = (node) => {
        if (node.children) {
            node.children = sortNodes(node.children);
            node.children.forEach(sortTreeNodes);
        }
    };
    sortTreeNodes(root);
    return root;
}
