require("@nomicfoundation/hardhat-toolbox");
const { vars } = require("hardhat/config");

const INFURA_API_KEY = vars.get("INFURA_API_KEY");
const SEPOLIA_PRIVATE_KEY = vars.get("SEPOLIA_PRIVATE_KEY");
const ETHERSCAN_API_KEY = vars.get("ETHERSCAN_API_KEY");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    solidity: {
        version: "0.8.19"
    },
    etherscan: {
        apiKey: ETHERSCAN_API_KEY,
    },
    networks: {
        sepolia: {
            url: `https://sepolia.infura.io/v3/${INFURA_API_KEY}`,
            accounts: [SEPOLIA_PRIVATE_KEY],
        }
    }
};
