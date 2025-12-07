const hre = require("hardhat");
const fs = require('fs');

async function main() {
  const Certificate = await hre.ethers.getContractFactory("Certificate");
  const certificate = await Certificate.deploy();
  await certificate.waitForDeployment();
  const address = await certificate.getAddress();
  
  console.log("Certificate Contract deployed to:", address);
  
  // Save address to file for other scripts to use
  fs.writeFileSync('contract-address.txt', address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
