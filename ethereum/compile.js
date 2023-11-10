const path = require("path");
const fs = require("fs-extra");
const solc = require("solc");

const buildPath = path.resolve(__dirname, "build");
fs.removeSync(buildPath);

const contractsPath = path.resolve(__dirname, "contracts");
const fileNames = fs.readdirSync(contractsPath);

const input = {
    language: "Solidity",
    sources: fileNames.reduce((input, fileName) => {
        const filePath = path.resolve(contractsPath, fileName);
        const source = fs.readFileSync(filePath, "utf8");
        return { ...input, [fileName]: { content: source } };
    }, {}),
    settings: {
        outputSelection: {
            "*": {
                "*": ["abi", "evm.bytecode.object"],
            },
        },
    },
};

// Compile all contracts
const output = JSON.parse(solc.compile(JSON.stringify(input)));

fs.ensureDirSync(buildPath);

fileNames.map((fileName) => {
   const contracts = Object.keys(output.contracts[fileName]);
   contracts.map((contract) => {
       fs.outputJsonSync(
           path.resolve(buildPath, contract + ".json"),
           output.contracts[fileName][contract]
       )
   })
});