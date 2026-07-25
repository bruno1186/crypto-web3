import { expect } from 'chai';
import { ethers } from 'hardhat';

describe('Token', () => {
  const initialSupply = ethers.parseEther('1000000');

  it('atribui o supply inicial ao deployer', async () => {
    const [owner] = await ethers.getSigners();
    const token = await ethers.deployContract('Token', [initialSupply]);
    expect(await token.balanceOf(owner.address)).to.equal(initialSupply);
  });

  it('permite ao owner mintar novos tokens', async () => {
    const [, other] = await ethers.getSigners();
    const token = await ethers.deployContract('Token', [initialSupply]);
    await token.mint(other.address, ethers.parseEther('100'));
    expect(await token.balanceOf(other.address)).to.equal(
      ethers.parseEther('100'),
    );
  });

  it('bloqueia mint de nao-owner', async () => {
    const [, other] = await ethers.getSigners();
    const token = await ethers.deployContract('Token', [initialSupply]);
    await expect(
      token.connect(other).mint(other.address, 1n),
    ).to.be.revertedWithCustomError(token, 'OwnableUnauthorizedAccount');
  });
});
