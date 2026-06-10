// ESLint v9 flat config
// We turn off a few rules that are intentionally used patterns in this codebase
// (async fetch + setState in useEffect, cmdk lib custom attribute, etc.) so the
// project lint stays focused on real issues rather than stylistic noise.
module.exports = [
  {
    ignores: ["build/**", "node_modules/**", "plugins/**"],
  },
  {
    rules: {
      "react-hooks/set-state-in-effect": "off",
      "react/no-unknown-property": ["error", { ignore: ["cmdk-input-wrapper"] }],
    },
  },
  {
    files: ["src/components/ui/**/*.{js,jsx}"],
    rules: {
      "react/no-unstable-nested-components": "off",
      "no-empty": "off",
    },
  },
  {
    files: ["src/context/AuthContext.jsx", "src/components/PendingApproval.jsx"],
    rules: {
      "no-empty": "off",
    },
  },
];
