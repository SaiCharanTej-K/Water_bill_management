// scripts/deploy.js

const hre = require("hardhat");

async function main() {
    // Compile contracts (optional but good in dev)
    await hre.run('compile');

    // Get the contract factory
    const WaterBill = await hre.ethers.getContractFactory("WaterBill");

    // Deploy the contract
    const waterBill = await WaterBill.deploy();

    // Wait for deployment to complete (ethers v6)
    await waterBill.waitForDeployment();

    // Print deployed contract address
    console.log(`✅ Contract deployed at: ${waterBill.target}`);
}

main().catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exitCode = 1;
});
