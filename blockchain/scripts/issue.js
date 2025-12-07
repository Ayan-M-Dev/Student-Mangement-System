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

    const studentId = 101; // Example Student ID
    const hash = "QmExampleHashForStudent101";

    console.log(`Issuing certificate for Student ${studentId}...`);
    try {
        const tx = await contract.issueCertificate(studentId, hash);
        console.log("Transaction sent:", tx.hash);
        await tx.wait();
        console.log("Certificate Issued Successfully!");
    } catch (e) {
        console.error("Error issuing certificate:", e.message);
    }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
