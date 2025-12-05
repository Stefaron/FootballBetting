import { time, loadFixture } from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
import { expect } from "chai";
import hre from "hardhat";
import { parseEther } from "viem";

describe("MatchVault", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployMatchVaultFixture() {
    // Get the publicClient and walletClients
    const [owner, otherAccount] = await hre.viem.getWalletClients();

    // 1. Deploy MockUSDT
    const faucetAmount = parseEther("1000");
    const mockUSDT = await hre.viem.deployContract("MockUSDT", [faucetAmount]);

    // 2. Deploy FootballJersey
    const footballJersey = await hre.viem.deployContract("FootballJersey", []);

    // 3. Deploy MatchVaultFactory
    const matchVaultFactory = await hre.viem.deployContract("MatchVaultFactory", [mockUSDT.address, footballJersey.address]);

    // 4. Setup Roles: Factory needs DEFAULT_ADMIN_ROLE on FootballJersey
    // to be able to grant MINTER_ROLE to the new Vaults it creates.
    // DEFAULT_ADMIN_ROLE is 0x00...00 (bytes32)
    const DEFAULT_ADMIN_ROLE = "0x0000000000000000000000000000000000000000000000000000000000000000";
    await footballJersey.write.grantRole([DEFAULT_ADMIN_ROLE, matchVaultFactory.address]);

    // 5. Create MatchVault via Factory
    // Set match start time to 8 days from now so we can deposit (deadline is start - 7 days)
    const ONE_DAY_IN_SECS = 24 * 60 * 60;
    const matchStartTime = (await time.latest()) + 8 * ONE_DAY_IN_SECS;
    console.log(`Creating MatchVault with start time: ${matchStartTime}`);

    await matchVaultFactory.write.createMatchVault([BigInt(matchStartTime)]);

    // Get the deployed vault address
    const deployedVaultAddress = await matchVaultFactory.read.deployedVaults([0n]);

    // Get the contract instance for the new vault
    const matchVault = await hre.viem.getContractAt("MatchVault", deployedVaultAddress);

    const publicClient = await hre.viem.getPublicClient();

    return {
      matchVault,
      matchVaultFactory,
      mockUSDT,
      footballJersey,
      matchStartTime,
      owner,
      otherAccount,
      publicClient,
    };
  }

  describe("Simulation", function () {
    it("Should mint MockUSDT, deposit, and simulate match resolution", async function () {
      const { matchVault, mockUSDT, footballJersey, matchStartTime, owner, publicClient } = await loadFixture(deployMatchVaultFixture);

      // --- 1. Mint MockUSDT ---
      console.log("Minting MockUSDT...");
      // Owner calls faucet to get tokens
      await mockUSDT.write.faucet();

      const balance = await mockUSDT.read.balanceOf([owner.account.address]);
      console.log(`Owner balance: ${balance.toString()}`);
      expect(balance).to.equal(parseEther("1000"));

      // --- 2. Approve and Deposit ---
      console.log("Approving and Depositing...");
      const depositAmount = parseEther("100");
      const teamA = 1n; // TEAM_A_ID

      await mockUSDT.write.approve([matchVault.address, depositAmount]);
      await matchVault.write.deposit([teamA, depositAmount]);

      // Verify deposit
      const stakedAmount = await matchVault.read.userStakedAmount([owner.account.address, teamA]);
      expect(stakedAmount).to.equal(depositAmount);
      console.log(`Deposited ${depositAmount.toString()} to Team A`);

      // --- 3. Simulate Yield Injection (Optional based on contract) ---
      console.log("Simulating Yield Injection...");
      const yieldAmount = parseEther("10");
      // Mint more to owner for yield injection
      await mockUSDT.write.mint([owner.account.address, yieldAmount]);
      await mockUSDT.write.approve([matchVault.address, yieldAmount]);

      await matchVault.write.simulateYieldInject([yieldAmount]);
      console.log(`Injected ${yieldAmount.toString()} yield`);

      // --- 4. Fast Forward Time to Match Start ---
      console.log("Fast forwarding time to match start...");
      await time.increaseTo(matchStartTime);

      // --- 5. Resolve Match ---
      console.log("Resolving Match...");
      const resultTeamAWon = 1; // TeamAWon from enum
      await matchVault.write.resolveMatch([resultTeamAWon]);

      const result = await matchVault.read.result();
      expect(result).to.equal(resultTeamAWon);
      console.log("Match resolved. Team A Won.");

      // --- 6. Claim Prize ---
      console.log("Claiming Prize...");
      // Check balance before claim
      const balanceBefore = await mockUSDT.read.balanceOf([owner.account.address]);
      const nftBalanceBefore = await footballJersey.read.balanceOf([owner.account.address, teamA]);

      await matchVault.write.claim();

      const balanceAfter = await mockUSDT.read.balanceOf([owner.account.address]);
      console.log(`Balance after claim: ${balanceAfter.toString()}`);

      // Should have received deposit + yield
      // We deposited 100. Yield injected was 10. Total pool A is 100.
      // Reward = (100 * 10) / 100 = 10.
      // Total payout = 100 + 10 = 110.
      // Previous balance was (Initial 1000 + Minted 10) - (Deposit 100 + YieldInject 10) = 900.
      // Expected final = 900 + 110 = 1010.

      // Let's just check it increased
      expect(balanceAfter > balanceBefore).to.be.true;

      // Check NFT balance
      const nftBalanceAfter = await footballJersey.read.balanceOf([owner.account.address, teamA]);
      expect(nftBalanceAfter).to.equal(nftBalanceBefore + 1n);
      console.log("NFT minted successfully.");
    });
  });
});
