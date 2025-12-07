// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Certificate {
    address public owner;
    
    // Mapping from Student ID to Certificate Hash (IPFS hash or similar)
    mapping(uint256 => string) private certificates;

    event CertificateIssued(uint256 indexed studentId, string dataHash);

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can perform this action");
        _;
    }

    // Issue a new certificate
    function issueCertificate(uint256 studentId, string memory dataHash) public onlyOwner {
        require(bytes(certificates[studentId]).length == 0, "Certificate already issued for this student");
        certificates[studentId] = dataHash;
        emit CertificateIssued(studentId, dataHash);
    }

    // Verify a certificate
    function verifyCertificate(uint256 studentId) public view returns (string memory) {
        return certificates[studentId];
    }
}
