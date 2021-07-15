const fs = require("fs");
const path = require("path");
const { promisify } = require("util");

const readDir = promisify(fs.readdir);
const writeFile = promisify(fs.writeFile);

const getDomains = () =>
  readDir(path.resolve(__dirname, "..", "src", "handlers"));
const getDomainHandlers = (domainName) =>
  readDir(path.resolve(__dirname, "..", "src", "handlers", domainName)).then(
    (handlerNames) =>
      handlerNames.map((handlerName) => handlerName.split(".")[0])
  );

const writeHandlerTree = (content) => writeFile(path.resolve(__dirname, "..", "src", "gen", "handlerTree.ts"), content)

const createHandlerTreeFile = async (handlerTree) => {
  const domains = Object.keys(handlerTree);

  const importRows = domains.map((domain) =>
    handlerTree[domain]
      .map(
        (handlerName) =>
          `import { ${handlerName} } from "../handlers/${domain}/${handlerName}";`
      )
      .join("\n")
  ).join('\n');

  const handlerTreeSection = `
export const handlerTree = {${domains
    .map(
      (domain) => `
    ${domain}: {
      ${handlerTree[domain].map((handlerName) => handlerName).join(",\n      ")}
    }`
    )
    .join(",")}
}
  `;

  const finalContent = [importRows, handlerTreeSection].join("\n");

  await writeHandlerTree(finalContent);
};

const generateHandlerTree = async () => {
  let handlerTree = {};
  const domains = await getDomains();

  for (const domain of domains) {
    const handlers = await getDomainHandlers(domain);
    handlerTree[domain] = handlers;
  }

  await createHandlerTreeFile(handlerTree);
};

generateHandlerTree();
