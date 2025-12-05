// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract FootballJersey is ERC1155, AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    // Nama token untuk keperluan display di marketplace (OpenSea, dll)
    string public name = "Hackathon Match Jersey";
    string public symbol = "HMJ";

    constructor()
        ERC1155(
            "https://violet-obedient-porpoise-293.mypinata.cloud/ipfs/bafybeidze2yh6du423fscw5hblxzxuyzlwmxjb44g6xbr7xqvjhou23nxq/{id}.json"
        )
    {
        // Memberikan admin role ke deployer
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    // Fungsi ini hanya bisa dipanggil oleh address yang punya MINTER_ROLE (yaitu contract Vault nanti)
    function mintWinningJersey(
        address to,
        uint256 id,
        uint256 amount
    ) external onlyRole(MINTER_ROLE) {
        _mint(to, id, amount, "");
    }

    // Override function required by Solidity
    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC1155, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
