// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./FootballJersey.sol"; // Import kontrak NFT

contract MatchVault is ReentrancyGuard, Ownable {
    using SafeERC20 for IERC20;

    // --- State Variables ---
    IERC20 public immutable token; // MockUSDT
    FootballJersey public immutable nft; // Jersey NFT

    uint256 public immutable matchStartTime;
    uint256 public immutable depositDeadline;

    // Konstanta ID Tim
    uint256 public constant TEAM_A_ID = 1;
    uint256 public constant TEAM_B_ID = 2;

    // Tracking Total Pool
    uint256 public totalStakedTeamA;
    uint256 public totalStakedTeamB;

    // Tracking User Deposit (User => Team ID => Amount)
    mapping(address => mapping(uint256 => uint256)) public userStakedAmount;
    // Tracking apakah user sudah claim
    mapping(address => bool) public hasClaimed;

    enum MatchResult {
        Pending,
        TeamAWon,
        TeamBWon,
        Draw
    }
    MatchResult public result;

    // --- Custom Errors (Gas Efficient) ---
    error DepositClosed();
    error MatchNotEnded();
    error AlreadyClaimed();
    error NothingToClaim();
    error InvalidTeam();
    error SimulationOnly();

    // --- Events ---
    event Staked(address indexed user, uint256 teamId, uint256 amount);
    event MatchResolved(MatchResult result);
    event PrizeClaimed(
        address indexed user,
        uint256 amountReturned,
        uint256 yieldEarned,
        bool nftMinted
    );
    event YieldInjected(uint256 amount);

    constructor(
        address _token,
        address _nft,
        uint256 _matchStartTime
    ) Ownable(msg.sender) {
        token = IERC20(_token);
        nft = FootballJersey(_nft);
        matchStartTime = _matchStartTime;
        // Deadline set to match start time for DEMO purposes (originally - 7 days)
        depositDeadline = _matchStartTime;
        result = MatchResult.Pending;
    }

    // --- User Actions ---

    function deposit(uint256 _teamId, uint256 _amount) external nonReentrant {
        if (block.timestamp >= depositDeadline) revert DepositClosed();
        if (_teamId != TEAM_A_ID && _teamId != TEAM_B_ID) revert InvalidTeam();
        if (_amount == 0) revert NothingToClaim();

        // Update State sebelum transfer (Checks-Effects-Interactions)
        userStakedAmount[msg.sender][_teamId] += _amount;

        if (_teamId == TEAM_A_ID) {
            totalStakedTeamA += _amount;
        } else {
            totalStakedTeamB += _amount;
        }

        token.safeTransferFrom(msg.sender, address(this), _amount);
        emit Staked(msg.sender, _teamId, _amount);
    }

    function claim() external nonReentrant {
        if (result == MatchResult.Pending) revert MatchNotEnded();
        if (hasClaimed[msg.sender]) revert AlreadyClaimed();

        uint256 stakeA = userStakedAmount[msg.sender][TEAM_A_ID];
        uint256 stakeB = userStakedAmount[msg.sender][TEAM_B_ID];

        if (stakeA == 0 && stakeB == 0) revert NothingToClaim();

        hasClaimed[msg.sender] = true; // Tandai sudah claim

        uint256 payoutAmount = 0;
        uint256 yieldReward = 0;
        bool mintNft = false;
        uint256 nftIdToMint = 0;

        // Logika Distribusi
        if (result == MatchResult.Draw) {
            // Draw: Balikin modal saja untuk kedua kubu
            payoutAmount = stakeA + stakeB;
        } else if (result == MatchResult.TeamAWon) {
            // Team A Menang
            if (stakeA > 0) {
                // Menang: Modal + Yield + NFT
                uint256 totalYield = _calculateTotalYield();
                // Rumus Yield: (UserStake / TotalPoolA) * TotalYield
                yieldReward = (stakeA * totalYield) / totalStakedTeamA;
                payoutAmount = stakeA + yieldReward;
                mintNft = true;
                nftIdToMint = TEAM_A_ID;
            }
            if (stakeB > 0) {
                // Kalah: Modal Balik Saja
                payoutAmount += stakeB;
            }
        } else if (result == MatchResult.TeamBWon) {
            // Team B Menang
            if (stakeB > 0) {
                uint256 totalYield = _calculateTotalYield();
                yieldReward = (stakeB * totalYield) / totalStakedTeamB;
                payoutAmount = stakeB + yieldReward;
                mintNft = true;
                nftIdToMint = TEAM_B_ID;
            }
            if (stakeA > 0) {
                payoutAmount += stakeA;
            }
        }

        // Eksekusi Transfer
        if (payoutAmount > 0) {
            token.safeTransfer(msg.sender, payoutAmount);
        }

        // Eksekusi Mint NFT
        if (mintNft) {
            nft.mintWinningJersey(msg.sender, nftIdToMint, 1);
        }

        emit PrizeClaimed(msg.sender, payoutAmount, yieldReward, mintNft);
    }

    // --- Admin / Internal Logic ---

    // Menghitung berapa banyak token ekstra yang ada di kontrak (Yield)
    function _calculateTotalYield() internal view returns (uint256) {
        uint256 currentBalance = token.balanceOf(address(this));
        uint256 principal = totalStakedTeamA + totalStakedTeamB;
        if (currentBalance <= principal) return 0;
        return currentBalance - principal;
    }

    function resolveMatch(MatchResult _result) external onlyOwner {
        require(block.timestamp >= matchStartTime, "Match not started yet"); // Optional check
        result = _result;
        emit MatchResolved(_result);
    }

    // Fungsi Hackathon: Simulasi Yield Masuk
    // Admin harus sudah approve token ke contract ini sebelum panggil fungsi ini
    function simulateYieldInject(uint256 _amount) external onlyOwner {
        token.safeTransferFrom(msg.sender, address(this), _amount);
        emit YieldInjected(_amount);
    }
}
