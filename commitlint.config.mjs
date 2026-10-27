const config = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    // Changelog bodies legitimately contain long lines and URLs.
    "body-max-line-length": [0],
    "footer-max-line-length": [0],
  },
}

export default config
