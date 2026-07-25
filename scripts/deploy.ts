import { ethers } from 'hardhat';

async function main() {
  const initialSupply = ethers.parseEther('1000000');
  const token = await ethers.deployContract('Token', [initialSupply]);
  await token.waitForDeployment();

  console.log(`Token deployed to: ${await token.getAddress()}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
