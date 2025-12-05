// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MockUSDT is ERC20, ERC20Burnable, Ownable {
    uint256 public faucetAmount;

    constructor(
        uint256 _faucetAmount
    ) ERC20("Mock USDT", "mUSDT") Ownable(msg.sender) {
        faucetAmount = _faucetAmount;
    }

    /// @notice User claim faucet (no max supply)
    function faucet() external {
        _mint(msg.sender, faucetAmount);
    }

    /// @notice Owner can mint unlimited supply
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }

    /// @notice Set default faucet amount
    function setFaucetAmount(uint256 _amount) external onlyOwner {
        faucetAmount = _amount;
    }
}
