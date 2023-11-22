import { ethers } from "hardhat";

async function main() {
  const kittyFactory = await ethers.deployContract("KittyFactory");

  await kittyFactory.waitForDeployment();

  console.log(`KittyFactory deployed to ${kittyFactory.target}`);

  const zombieOwnership = await ethers.deployContract("ZombieOwnership");

  await zombieOwnership.waitForDeployment();

  console.log(`ZombieOwnership deployed to ${kittyFactory.target}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
