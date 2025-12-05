// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "./MatchVault.sol";
import "./FootballJersey.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MatchVaultFactory is Ownable {
    // Array untuk menyimpan semua alamat Vault yang pernah dibuat
    MatchVault[] public deployedVaults;

    address public immutable tokenAddress;
    address public immutable nftAddress;

    event VaultCreated(
        address indexed vaultAddress,
        uint256 matchStartTime,
        uint256 index
    );

    constructor(
        address _tokenAddress,
        address _nftAddress
    ) Ownable(msg.sender) {
        tokenAddress = _tokenAddress;
        nftAddress = _nftAddress;
    }

    /**
     * @dev Membuat Vault baru untuk pertandingan spesifik.
     * @param _matchStartTime Waktu mulai pertandingan (Unix Timestamp).
     * Syarat: Factory harus punya DEFAULT_ADMIN_ROLE di kontrak NFT agar bisa memberikan MINTER_ROLE.
     */
    function createMatchVault(uint256 _matchStartTime) external {
        // 1. Deploy Contract MatchVault baru
        MatchVault newVault = new MatchVault(
            tokenAddress,
            nftAddress,
            _matchStartTime
        );

        // 2. Transfer Ownership Vault ke msg.sender (Anda)
        // Agar Anda bisa memanggil injectYield() atau resolveMatch() nantinya
        newVault.transferOwnership(msg.sender);

        // 3. AUTO-SETUP: Berikan MINTER_ROLE ke Vault baru
        // Factory memanggil kontrak NFT untuk memberikan izin ke Vault baru
        FootballJersey(nftAddress).grantRole(
            keccak256("MINTER_ROLE"),
            address(newVault)
        );

        // 4. Simpan ke registry
        deployedVaults.push(newVault);

        emit VaultCreated(
            address(newVault),
            _matchStartTime,
            deployedVaults.length - 1
        );
    }

    // Helper untuk Frontend mengambil semua vault
    function getDeployedVaults() external view returns (MatchVault[] memory) {
        return deployedVaults;
    }
}
