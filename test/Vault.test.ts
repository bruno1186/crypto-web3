import { expect } from "chai";
import { ethers } from "hardhat";

describe("Vault", () => {
  const INITIAL = ethers.parseEther("1000000");
  const AMOUNT = ethers.parseEther("100");

  async function deploy() {
    const [owner, user] = await ethers.getSigners();

    const Token = await ethers.getContractFactory("Token");
    const token = await Token.deploy(INITIAL);
    await token.waitForDeployment();

    const Vault = await ethers.getContractFactory("Vault");
    const vault = await Vault.deploy(await token.getAddress());
    await vault.waitForDeployment();

    await token.transfer(user.address, AMOUNT);
    return { token, vault, owner, user };
  }

  it("deposita e credita o saldo do usuario", async () => {
    const { token, vault, user } = await deploy();
    await token.connect(user).approve(await vault.getAddress(), AMOUNT);
    await expect(vault.connect(user).deposit(AMOUNT))
      .to.emit(vault, "Deposited")
      .withArgs(user.address, AMOUNT);

    expect(await vault.balanceOf(user.address)).to.equal(AMOUNT);
    expect(await vault.totalDeposited()).to.equal(AMOUNT);
  });

  it("saca e reduz o saldo", async () => {
    const { token, vault, user } = await deploy();
    await token.connect(user).approve(await vault.getAddress(), AMOUNT);
    await vault.connect(user).deposit(AMOUNT);

    await expect(vault.connect(user).withdraw(AMOUNT))
      .to.emit(vault, "Withdrawn")
      .withArgs(user.address, AMOUNT);

    expect(await vault.balanceOf(user.address)).to.equal(0n);
    expect(await token.balanceOf(user.address)).to.equal(AMOUNT);
  });

  it("reverte deposito de valor zero", async () => {
    const { vault, user } = await deploy();
    await expect(vault.connect(user).deposit(0)).to.be.revertedWithCustomError(
      vault,
      "ZeroAmount"
    );
  });

  it("reverte saque acima do saldo", async () => {
    const { vault, user } = await deploy();
    await expect(vault.connect(user).withdraw(AMOUNT)).to.be.revertedWithCustomError(
      vault,
      "InsufficientBalance"
    );
  });
});
