// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title Token
 * @notice Token ERC-20 de exemplo com funcao de mint restrita ao owner.
 */
contract Token is ERC20, Ownable {
    constructor(uint256 initialSupply)
        ERC20("CryptoWeb3 Token", "CW3")
        Ownable(msg.sender)
    {
        _mint(msg.sender, initialSupply);
    }

    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
}
