# Userfront Toolkit

## Development

See the root `README.md` in the root of this repo for full dev setup instructions.

To install and run this package only for development, in this folder:

1. Install dependencies: `npm install`

2. Run unit tests: `npm test`

3. Run unit tests in watch mode: `npm run watch`

4. Run Storybook: `npm run storybook` and see output for local server URL

### Architecture

This project uses [Vite](https://vitejs.dev/) to build the bundle, using Vite's build-in support for TypeScript.

Some parts of the project are in TypeScript `.ts/.tsx` and other parts are in JavaScript `.js/.jsx`. TypeScript is used where its features are particularly beneficial, mostly in the models that describe forms' behavior.

There are two entry points.

One exports the forms as React components:

```js
import Userfront, { LoginForm } from "@userfront/toolkit/react";
```

The other registers the forms as Web Components, suitable for usage with most front-end frameworks or in plain JS:

```js
import Userfront from "@userfront/toolkit/web-components";
```

After import, the Web Components are registered and can be used anywhere in the app:

```html
<body>
  <login-form tenant-id="mytenantid"></login-form>
</body>
```

**Testing**

[Vitest](https://vitest.dev/) is used for unit tests. Its interface is similar to Jest, with a few additional features.

There is a useful [VS Code extension](https://marketplace.visualstudio.com/items?itemName=ZixuanChen.vitest-explorer) for Vitest to run tests and view results directly in the editor.

**High-level structure**

The signup and login forms are split into _models_ and _views_.

Each "screen" on the form is a _view_. These are (mostly) stateless React components that emit events on user actions and receive a _context_ with current state and data. The intent is that, for ease of testing and maintenance, each form is a simple function of data to UI. Every form state can be accessed by passing an appropriate context to the form component.

Each _view_ has a _model_, which is an [XState](https://xstate.js.org/) statechart describing how the form changes over time as events happen. There is a [VS Code plugin](https://marketplace.visualstudio.com/items?itemName=statelyai.stately-vscode) for XState that allows visualizing and editing statecharts directly in the editor. **Editing statecharts with this extension is not recommended** because it tends to make unwanted changes, but it's useful for visualizing statecharts to understand the model's behavior.

The models use TypeScript for added robustness via static typing.

The signup and login _forms_ also have models, which incorporate the models for each view.

The logout button, password reset request form, and password reset form are simple enough that they don't use XState models and aren't split into views.

The `src` directory contains the package's source:

- `src/assets` - static assets
- `src/themes` - CSS files
- `src/components` - basic components for the forms: buttons, inputs, etc.
- `src/views` - views for the signup and login forms
- `src/models` - each view, and the login and signup form, has an XState model in this folder
- `src/forms` - the "plain" forms, without models. The login and signup forms here are more for test usage.
- `src/packaged-forms` - the "packaged" login and signup forms, connected to appropriate models, for client usage.
- `src/services` - internal tools
- `src/utils` - internal tools
- `src/stories` - Storybook stories.

**CSS**

The forms' CSS is in `themes/dynamic.css`. This uses CSS variables to allow full customization of forms' appearance. Variables are all prefixed `--userfront` to separate them from variables in client code. The `dynamic` theme uses CSS's color modification capabilities (`color-mix` mostly) to derive a full color scheme (with active/hover states etc) from 1-3 main colors: "dark" (primary), "light" (secondary), and "accent".

**Storybook**

The components and views can all be inspected with Storybook. There is a custom-built system to declare and inject CSS variables into components in Storybook and allow modifying them with knobs.
