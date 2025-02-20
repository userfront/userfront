module.exports = {
  stories: ["../src/stories/views/SelectFactor.stories.jsx", "../src/stories/views/*.stories.@(js|ts|jsx|tsx|mdx)", "../src/stories/components/*.stories.@(js|ts|jsx|tsx|mdx)", "../src/stories/forms/*.stories.@(js|ts|jsx|tsx|mdx)", "../src/**/*.stories.@(js|ts|jsx|tsx|mdx)"],
  addons: ["@storybook/addon-links", "@storybook/addon-essentials", "@storybook/addon-interactions", "storybook-addon-pseudo-states"],
  framework: {
    name: "@storybook/react-vite",
    options: {}
  },
  staticDirs: ["./public"],
  async viteFinal(config) {
    return {
      ...config,
      rollupOptions: {
        ...config.rollupOptions,
        // Externalize deps that shouldn't be bundled
        external: ["react", "react-dom"],
        output: {
          // Global vars to use in UMD build for externalized deps
          globals: {
            react: "React",
            "react-dom": "ReactDOM"
          }
        }
      }
    };
  },
  docs: {
    autodocs: true
  }
};