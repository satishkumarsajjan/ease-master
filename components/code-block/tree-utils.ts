import { FolderNode, TreeNode } from "./types"

export function buildTree(files: Record<string, unknown>): TreeNode[] {
  const root: TreeNode[] = []
  Object.keys(files).forEach((path) => {
    const parts = path.split("/")
    let currentLevel = root
    parts.forEach((part, index) => {
      const isFile = index === parts.length - 1
      let existing = currentLevel.find((n) => n.name === part)
      if (!existing) {
        if (isFile) {
          currentLevel.push({ name: part, type: "file", path })
        } else {
          const folderNode: FolderNode = {
            name: part,
            type: "folder",
            path: parts.slice(0, index + 1).join("/"),
            children: [],
          }
          currentLevel.push(folderNode)
          existing = folderNode
        }
      }
      if (!isFile) currentLevel = (existing as FolderNode).children
    })
  })

  function optimize(nodes: TreeNode[]): TreeNode[] {
    return nodes.map((node) => {
      if (node.type === "folder") {
        node.children = optimize(node.children)
        if (node.children.length === 1 && node.children[0].type === "folder") {
          const child = node.children[0] as FolderNode
          return { ...child, name: `${node.name}/${child.name}` }
        }
      }
      return node
    })
  }
  return optimize(root)
}
