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

# 🤖 CLI

`Lenzy` also provides a command-line tool that allows you to search for and navigate to your JSX components. Optimally it works best for NextJS projects and all you have to do is pass the directory of your `pages` folder. To use the CLI, simply run:

```sh
yarn lenzy compute-index <pages-dir> <pages-catalog-output> <fuse-index-output> <generate-absolute-paths>
```

This will compute the index of your JSX components tree of the provided `pages-dir` and save it in the location you provided in `pages-catalog-output` and `fuse-index-output`.

## Example

Assuming your project is structured as follows:

```lua
├── .next/
├── components/
│   ├── About/
│   │   ├── Header.js
│   │   └── AboutPage.js
│   ├── development-tool/
│   │   └── QuickAccess/
│   │       └── QuickAccess.js
├── pages/
│   ├── _app.js
│   ├── _document.js
│   ├── index.js
│   ├── about.js
│   ├── blog/
│   │   ├── index.js
│   │   ├── [slug].js
│   │   └── posts.js
│   └── contact.js
├── .eslintrc
├── .gitignore
├── next.config.js
├── package.json
├── README.md
└── yarn.lock
```

You have to run this command in the root path

```zsh
yarn lenzy compute-index ./pages ./components/development-tools/QuickAccess/pages-catalog.json ./components/development-tools/QuickAccess/fuse-index.json true
```

The following JSONs will be created

### `./components/development-tools/QuickAccess/pages-catalog.json`

This is the whole list of all components from your pages, keep in mind the paths generated are relative since `generateAbsolutePaths` is `false` by default.

```json
[
  {
    "pageUrl": "/about",
    "path": "./components/About/AboutPage.js",
    "component": "AboutPage",
    "parentPath": "src/pages/about.js",
    "parents": []
  },
  {
    "pageUrl": "/about",
    "path": "./components/About/Header.js",
    "component": "Header",
    "parentPath": "./components/About/AboutPage.js",
    "parents": ["AboutPage"]
  }
  // further similar records...
]
```

Or if you provide the last `generateAbsolutePaths` as `true`, you will get the following

```json
[
  {
    "pageUrl": "/about",
    "path": "/user/dev/project/components/About/AboutPage.js",
    "component": "AboutPage",
    "parentPath": "src/pages/about.js",
    "parents": []
  },
  {
    "pageUrl": "/about",
    "path": "/user/dev/project/components/About/Header.js",
    "component": "Header",
    "parentPath": "/user/dev/project/components/About/AboutPage.js",
    "parents": ["AboutPage"]
  }
  // further similar records...
]
```

### `./components/development-tools/QuickAccess/fuse-index.json`

```json
{
  // some indexing stuff that we don't want to get involved in 🥲
}
```

# 📖 API

Lenzy exports a single component, `Provider`, which is a search bar that allows you to quickly find and navigate to your JSX components.

```jsx
import { Provider } from "lenzy";
import PAGES_DICT from "./pages-catalog.json";
import FUSE_INDEX from "./fuse-index.json";

const QuickAccess = () => (
  <Provider pagesDictionary={PAGES_DICT} fuseIndex={FUSE_INDEX}>
    {({ results, value, onChange }) => (
      <>
        <h1>Quick Access Component</h1>
        {/* your thang 🌃 */}
        <input value={value} onChange={(ev) => event.target.value} />
        <ul>
          {results.map((result) => (
            <li onClick={() => router.push(result.pageUrl)}>
              {result.parents.join("/")} - {result.component}
            </li>
          ))}
        </ul>
      </>
    )}
  </Provider>
);
```

This will add the `Provider` component to your app, allowing you to have access to the `value` of the search and the `onChange` which is a search triggerer and finally the `results` which is mainly everything related to the `value` you provided.

`results` is a list of matches related to the provided `value` and you can interpret that one item from the list will follow the object provided earlier in `pages-catalog.json`

## Local Example

Check [example](https://github.com/ylkhayat/lenzy/blob/main/example) folder and feel free to run the project locally through the following command

```sh
node ./dist/cli.js compute-index ./example/pages example/pages-dictionary.json example/fuse-index.json true
```

# 📜 License

Lenzy is released under the MIT License.

# 👨‍💻 Contributing

Contributions are welcome! If you'd like to contribute to Lenzy, please open an issue or pull request.

# 📬 Contact

If you have any questions or comments about Lenzy, please feel free to contact me at yousseftarek@live.com.

Thank you for using Lenzy! 🎉
