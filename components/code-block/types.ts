export interface CodeFile {
  code: string
  language?: string
  highlightLines?: number[]
  addLines?: number[]
  removeLines?: number[]
  focusOnly?: boolean
}

export interface CodeBlockProps {
  files: Record<string, CodeFile | string>
  defaultFile?: string
  height?: string | number
  expandable?: boolean
  initialExpanded?: boolean
  showLineNumbers?: boolean
  className?: string
}

export type FileNode = { name: string; type: "file"; path: string }

export type FolderNode = {
  name: string
  type: "folder"
  path: string
  children: TreeNode[]
}

export type TreeNode = FileNode | FolderNode
