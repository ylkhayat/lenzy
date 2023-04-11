const fs = require("fs");
const path = require("path");

const Fuse = require("fuse.js");
const parser = require("@babel/parser");
const { exit } = require("process");
const traverse = require("@babel/traverse").default;

const PAGES_DIR = path.join(process.cwd(), process.argv[3]);
const INDEX_PATH_OUTPUT = path.join(process.cwd(), process.argv[4]);
const PARSED_FUSE_PATH_OUTPUT = path.join(process.cwd(), process.argv[5]);

console.log(
  "Here's some logs to know the parameters you passed to the script! 🎬",
);
console.table({
  PAGES_DIR,
  INDEX_PATH_OUTPUT,
  PARSED_FUSE_PATH_OUTPUT,
});
const relativeToAbsolutePath = (rootPath, filePath) => {
  let finalPath = "";
  const fileStat = fs.statSync(rootPath);
  if (filePath.startsWith("src/")) {
    finalPath = path.join(PAGES_DIR, "../../", `${filePath}.tsx`);
  } else if (fileStat.isDirectory()) {
    if (filePath.startsWith("../")) {
      finalPath = path.join(rootPath, `${filePath.replace("../", "./")}.tsx`);
    } else {
      finalPath = path.join(rootPath, `${filePath}.tsx`);
    }
  } else {
    if (filePath.startsWith("../")) {
      finalPath = path.join(
        rootPath,
        `${filePath.replace("../", "../../")}.tsx`,
      );
    } else {
      finalPath = path.join(rootPath, `${filePath.replace("./", "../")}.tsx`);
    }
  }
  if (fs.existsSync(finalPath)) {
    return path.relative(process.cwd(), finalPath);
  }
  return null;
};
const getAllPages = (dir) => {
  const pages = [];
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const fileStat = fs.statSync(filePath);

    if (fileStat.isDirectory()) {
      const nestedPages = getAllPages(filePath);
      pages.push(...nestedPages);
    } else {
      if (file.endsWith(".tsx") && !file.includes("_")) {
        const pagePath = filePath.substring(
          PAGES_DIR.length + 1,
          filePath.length - 4,
        );
        pages.push({ path: pagePath, url: `/${pagePath}` });
      }
    }
  }

  return pages;
};

const getAllComponents = (rootPath, filePath, pageUrl, parents) => {
  const allComponents = [];
  const referencedComponents = [];
  const modifiedFilePath = relativeToAbsolutePath(rootPath, filePath);
  if (modifiedFilePath) {
    const code = fs.readFileSync(modifiedFilePath, "utf-8");
    const importedComponents = [];

    const ast = parser.parse(code, {
      sourceType: "module",
      plugins: ["jsx", "typescript"],
    });

    traverse(ast, {
      ImportDeclaration: ({ node }) => {
        const importPath = node.source.value;
        if (
          (importPath.startsWith("src/") || importPath.startsWith(".")) &&
          !importPath.endsWith(".scss") &&
          !importPath.endsWith(".svg")
        ) {
          importedComponents.push({
            imports: node?.specifiers?.map(
              (specifier) => specifier?.imported?.name,
            ),
            path: importPath,
          });
        }
      },
      JSXElement: ({ node }) => {
        const componentName = node.openingElement.name.name;
        const treeComponent = importedComponents.find((comp) =>
          comp.imports.includes(componentName),
        );
        if (treeComponent && !referencedComponents.includes(componentName)) {
          referencedComponents.push(componentName);
          const subtree = getAllComponents(
            modifiedFilePath,
            treeComponent.path,
            pageUrl,
            [...parents, componentName],
          );
          const { imports: _, path: __, ...rest } = treeComponent;
          const modifiedPageUrl = pageUrl.replace(/\/index/, "");
          allComponents.push({
            ...rest,
            pageUrl: modifiedPageUrl,
            componentPath: relativeToAbsolutePath(
              modifiedFilePath,
              treeComponent.path,
            ),
            component: componentName,
            parentPath: modifiedFilePath,
            parents,
          });
          allComponents.push(...subtree);
        }
      },
    });
  }
  return allComponents;
};

const analyzePages = () => {
  const pages = getAllPages(PAGES_DIR);
  const treeComponents = [];
  for (const page of pages) {
    const pageUrl = `/${page.path}`;
    const treeComponent = getAllComponents(PAGES_DIR, pageUrl, pageUrl, []);
    treeComponents.push(...treeComponent);
  }
  return treeComponents;
};

const appTree = analyzePages();
const outputPath = INDEX_PATH_OUTPUT;
fs.writeFileSync(outputPath, JSON.stringify(appTree, null, 2));
console.log(`Page index saved to ${outputPath}`);
const fusePath = PARSED_FUSE_PATH_OUTPUT;
const myIndex = Fuse.createIndex(["parents", "component"], appTree);
fs.writeFileSync(fusePath, JSON.stringify(myIndex.toJSON()));
console.log(`Fuse index saved to ${fusePath}`);

process.exit(0);
