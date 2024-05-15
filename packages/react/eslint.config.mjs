export default [
  {
    ignores: [
      ".git/",
      "**/.git/",
      "dist/",
      "**/dist/",
      "build/",
      "**/build/",
      "public/",
      "**/public/",
      ".next/",
      "**/.next/",
      "coverage/",
      "**/coverage/",
      ".vercel/",
      "**/.vercel/",
      "node_modules/",
      "**/node_modules/"
    ]
  },
  {
    rules: {
      "no-unused-vars": "error",
      "no-undef": "error"
    }
  }
];
