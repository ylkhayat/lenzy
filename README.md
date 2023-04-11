# 🚀 Lenzy

[![NPM](https://img.shields.io/npm/v/lenzy.svg)](https://www.npmjs.com/package/lenzy)
[![downloads](https://img.shields.io/npm/dm/lenzy.svg)](https://www.npmjs.com/package/lenzy)

Lenzy is a TypeScript package that helps you quickly access your JSX components in your React project. It provides a simple command-line tool which is responsible to generate the indexes used for the search engine to do its thing 🌠 . Providing a `Provider` component that acts as a wrapper to whatever you want to do with the results, optimally allowing you to search for and navigate to your JSX components. This package uses [fuse.js](https://fusejs.io/) to handle the search over large amount of data 🎉!

## 📦 Installation

To install `Lenzy`, simply run:

```sh
npm install --save-dev lenzy
```

or

```sh
yarn add --dev lenzy
```

🚀 Quick Start
To use `Lenzy` in your project, you can import the Provider component from the package:

```jsx
import { Provider } from "lenzy";

function App() {
  return (
    <div>
      <h1>My React App</h1>
      <Provider>
        {({ results, value, onChange }) => <>{/* your thang 🌃 */}</>}
      </Provider>
      {/* rest of your app */}
    </div>
  );
}
```

This will add the `Provider` component to your app, allowing you to have access to the `value` of the search and the `onChange` which is a search triggerer and finally the `results` which is mainly everything related to the `value` you provided.

# 📖 API

Lenzy exports a single component, `Provider`, which is a search bar that allows you to quickly find and navigate to your JSX components.

# 🤖 CLI

`Lenzy` also provides a command-line tool that allows you to search for and navigate to your JSX components. To use the CLI, simply run:

```sh
yarn lenzy compute-index <pages-dir> <pages-dictionary-output> <fuse-index-output>
```

This will compute the index of your JSX components tree of the provided `pages-dir` and save it in the location you provided in `pages-dictionary-output` and `fuse-index-output`.

# 📜 License

Lenzy is released under the MIT License. See LICENSE for details.

# 👨‍💻 Contributing

Contributions are welcome! If you'd like to contribute to Lenzy, please open an issue or pull request.

# 📬 Contact

If you have any questions or comments about Lenzy, please feel free to contact me at yousseftarek@live.com.

Thank you for using Lenzy! 🎉
