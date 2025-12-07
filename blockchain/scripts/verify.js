const hre = require("hardhat");
const fs = require('fs');

async function main() {
    if (!fs.existsSync('contract-address.txt')) {
        console.error("Contract address not found! Run deploy.js first.");
        return;
    }
    const address = fs.readFileSync('contract-address.txt', 'utf-8').trim();
    const Certificate = await hre.ethers.getContractFactory("Certificate");
    const contract = Certificate.attach(address);

    const studentId = 101; 
    console.log(`Verifying certificate for Student ${studentId}...`);
    
    const hash = await contract.verifyCertificate(studentId);
    
    if (hash) {
        console.log("✅ Certificate Found!");
        console.log("Certificate Hash:", hash);
    } else {
        console.log("❌ No certificate found (Empty Hash).");
    }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
