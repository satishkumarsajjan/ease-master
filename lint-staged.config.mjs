const config = {
  "*.{ts,tsx}": ["prettier --write", "eslint --fix"],
  "*.{json,md,mdx,css}": ["prettier --write"],
}

export default config
