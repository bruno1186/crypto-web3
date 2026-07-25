// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title Vault
 * @notice Cofre de deposito de um token ERC-20. Cada endereco pode depositar
 *         e sacar seu proprio saldo. Usa SafeERC20 e ReentrancyGuard para
 *         seguir boas praticas de seguranca (checks-effects-interactions).
 */
contract Vault is ReentrancyGuard {
    using SafeERC20 for IERC20;

    IERC20 public immutable token;
    uint256 public totalDeposited;

    mapping(address => uint256) private _balances;

    event Deposited(address indexed account, uint256 amount);
    event Withdrawn(address indexed account, uint256 amount);

    error ZeroAmount();
    error InsufficientBalance(uint256 requested, uint256 available);

    constructor(IERC20 token_) {
        require(address(token_) != address(0), "token zero address");
        token = token_;
    }

    function balanceOf(address account) external view returns (uint256) {
        return _balances[account];
    }

    function deposit(uint256 amount) external nonReentrant {
        if (amount == 0) revert ZeroAmount();

        _balances[msg.sender] += amount;
        totalDeposited += amount;

        token.safeTransferFrom(msg.sender, address(this), amount);
        emit Deposited(msg.sender, amount);
    }

    function withdraw(uint256 amount) external nonReentrant {
        if (amount == 0) revert ZeroAmount();

        uint256 balance = _balances[msg.sender];
        if (amount > balance) revert InsufficientBalance(amount, balance);

        _balances[msg.sender] = balance - amount;
        totalDeposited -= amount;

        token.safeTransfer(msg.sender, amount);
        emit Withdrawn(msg.sender, amount);
    }
}
