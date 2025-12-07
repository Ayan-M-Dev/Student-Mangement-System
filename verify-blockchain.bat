@echo off
echo Starting Blockchain Container...
docker-compose up -d blockchain

echo Waiting for Hardhat Node to start...
timeout /t 5 /nobreak

echo Deploying Smart Contract...
docker-compose exec -T blockchain npx hardhat run scripts/deploy.js --network localhost

echo Issuing Certificate...
docker-compose exec -T blockchain npx hardhat run scripts/issue.js --network localhost

echo Verifying Certificate...
docker-compose exec -T blockchain npx hardhat run scripts/verify.js --network localhost

echo Done!
