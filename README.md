# Crypto zombies
A game  (DApp) running on Ethereum network.

## Requirements
1. WSL/Linux/MacOS
1. nodejs
1. npm
1. git
1. Metamask browser extension

## Setup
1. Copy .env to .env.local
1. Configure your mnemonic passphrase and infura url

## Contract Compilation and deployment
1. Compile code `npm run compile`
1. Set env variables from .env.local `set -o allexport && source .env.local && set +o allexport`
1. Deploy code to Sepolia test network `npm run deploy`
