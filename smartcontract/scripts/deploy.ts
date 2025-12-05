import hre from "hardhat";
import fs from "fs";
import { formatEther, parseEther, parseGwei } from "viem";

async function main() {
  console.log("🚀 Starting Deployment to Sepolia...");

  // MockUSDT constructor requires an initial faucet amount
  const initialFaucetAmount = parseEther("1000");
  const mockUSDT = await hre.viem.deployContract("MockUSDT", [initialFaucetAmount], {
    // Memaksa tip 50 Gwei agar transaksi "ngebut"
    maxPriorityFeePerGas: parseGwei("50"),
    maxFeePerGas: parseGwei("100"),
  });
  console.log(`✅ MockUSDT deployed to: ${mockUSDT.address}`);

  // --- 2. DEPLOY FOOTBALL JERSEY (NFT) ---
  const footballJersey = await hre.viem.deployContract("FootballJersey", [], {
    maxPriorityFeePerGas: parseGwei("50"),
    maxFeePerGas: parseGwei("100"),
  });
  console.log(`✅ FootballJersey deployed to: ${footballJersey.address}`);

  // --- 3. DEPLOY FACTORY ---
  const matchVaultFactory = await hre.viem.deployContract("MatchVaultFactory", [mockUSDT.address, footballJersey.address], {
    maxPriorityFeePerGas: parseGwei("50"),
    maxFeePerGas: parseGwei("100"),
  });
  console.log(`✅ MatchVaultFactory deployed to: ${matchVaultFactory.address}`);

  // --- 4. PREPARE DATA TO SAVE ---
  const deploymentData = {
    network: hre.network.name,
    timestamp: new Date().toISOString(),
    contracts: {
      MockUSDT: {
        address: mockUSDT.address,
        args: [],
      },
      FootballJersey: {
        address: footballJersey.address,
        args: [],
      },
      MatchVaultFactory: {
        address: matchVaultFactory.address,
        args: [mockUSDT.address, footballJersey.address],
      },
    },
  };

  // --- PERBAIKAN DI SINI ---
  // Kita tambahkan fungsi kecil (key, value) untuk mengubah BigInt jadi String
  fs.writeFileSync(
    "deployment-data.json",
    JSON.stringify(
      deploymentData,
      (key, value) => (typeof value === "bigint" ? value.toString() : value), // <--- Replacer Function
      2
    )
  );

  console.log("\n📁 Deployment data saved to 'deployment-data.json'");

  // --- 5. VERIFICATION ---
  console.log("\n⏳ Waiting for block confirmations (30s) before verification...");
  await new Promise((resolve) => setTimeout(resolve, 30000));

  console.log("🔍 Verifying MockUSDT...");
  await verify(mockUSDT.address, [initialFaucetAmount]);

  console.log("🔍 Verifying FootballJersey...");
  await verify(footballJersey.address, []);

  console.log("🔍 Verifying MatchVaultFactory...");
  await verify(matchVaultFactory.address, [mockUSDT.address, footballJersey.address]);

  console.log("\n🎉 ALL DONE! Check deployment-data.json");
}

// Helper untuk verify agar tidak crash script jika gagal
async function verify(contractAddress: string, args: any[]) {
  try {
    await hre.run("verify:verify", {
      address: contractAddress,
      constructorArguments: args,
    });
  } catch (e: any) {
    if (e.message.toLowerCase().includes("already verified")) {
      console.log("   -> Already verified!");
    } else {
      console.log("   -> Verification failed:", e.message);
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
