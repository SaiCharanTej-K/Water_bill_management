// scripts/deploy.js
const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying contract with account:", deployer.address);

  const balance = await deployer.getBalance();
  console.log("Account balance:", hre.ethers.utils.formatEther(balance), "ETH");

  const WaterBillManager = await hre.ethers.getContractFactory("WaterBillManager");
  const contract = await WaterBillManager.deploy();

  await contract.deployed();

  console.log("WaterBillManager deployed to:", contract.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
