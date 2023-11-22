##@ Crypto Zombies

help:  ## Display help
	@awk 'BEGIN {FS = ":.*##"; printf "\nUsage:\n  make \033[36m\033[0m\n"} /^[a-zA-Z_-]+:.*?##/ { printf "  \033[36m%-30s\033[0m %s\n", $$1, $$2 } /^##@/ { printf "\n\033[1m%s\033[0m\n", substr($$0, 5) } ' $(MAKEFILE_LIST)

setup-vars: ## Setup configuration variables
	npx hardhat vars setup

node: ## Start local node
	npx hardhat node

compile: ## Compile contracts
	npx hardhat compile

deploy: ## Deploy contracts to localhost
	npx hardhat run scripts/deploy.ts

deploy-sepolia: ## Deploy contracts to sepolia test network
	npx hardhat run scripts/deploy.ts --network sepolia

verify-sepolia: ## Verify contract on sepolia test network
	npx hardhat verify --network sepolia $(address)

tests: ## Run tests
	npx hardhat test

tests-typecheck: ## Run tests with type check
	npx hardhat test --typecheck

tests-with-gas: ## Run tests and report gas
	REPORT_GAS=true npx hardhat test

coverage: ## Run contract coverage
	npx hardhat coverage