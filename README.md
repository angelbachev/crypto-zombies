# Crypto zombies
A DApp game running on Ethereum network.

## Requirements
1. WSL/Linux/MacOS 
2. nodejs 
3. npm 
4. git 
5. make 
6. Metamask browser extension

## Setup
1. Install dependencies `npm install`
2. Configure variables `make setup-vars`
3. Compile contracts `make compile`
4. Deploy contracts to local network `make deploy`

## Deploy to sepolia test network
1. Deploy contracts to sepolia network `make deploy-sepolia`
2. Verify contracts `make verify-sepolia address=ADDRESS_OF_DEPLOYED_CONTRACT`

## Available make commands 
1. See all available make commands `make` or `make help`
2. Setup hardhat config vars `make setup-vars`
3. Run local node `make node`
4. Compile contracts `make compile`
5. Deploy to local network `make deploy`
6. Deploy to sepolia network `make deploy-sepolia`
7. Verify contract on sepolia network `make verify-sepolia address=ADDRESS_OF_DEPLOYED_CONTRACT`
8. Run tests `make tests`
9. Run test and report gas usage `make tests-with-gas`
10. Show test coverage `make coverage`
