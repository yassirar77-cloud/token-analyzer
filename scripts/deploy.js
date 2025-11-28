const hre = require("hardhat");

async function main() {
  console.log("Starting deployment...\n");

  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "ETH\n");

  // Set platform wallet (change this to your desired address)
  const platformWallet = deployer.address; // Or use a specific address

  // 1. Deploy BSDToken
  console.log("Deploying BSDToken...");
  const BSDToken = await ethers.getContractFactory("BSDToken");
  const initialSupply = 1000000; // 1 million tokens
  const bsdToken = await BSDToken.deploy(initialSupply);
  await bsdToken.waitForDeployment();
  const bsdTokenAddress = await bsdToken.getAddress();
  console.log("✓ BSDToken deployed to:", bsdTokenAddress);

  // 2. Deploy MusicNFT
  console.log("\nDeploying MusicNFT...");
  const MusicNFT = await ethers.getContractFactory("MusicNFT");
  const musicNFT = await MusicNFT.deploy();
  await musicNFT.waitForDeployment();
  const musicNFTAddress = await musicNFT.getAddress();
  console.log("✓ MusicNFT deployed to:", musicNFTAddress);

  // 3. Deploy StreamingAccess
  console.log("\nDeploying StreamingAccess...");
  const StreamingAccess = await ethers.getContractFactory("StreamingAccess");
  const streamingAccess = await StreamingAccess.deploy();
  await streamingAccess.waitForDeployment();
  const streamingAccessAddress = await streamingAccess.getAddress();
  console.log("✓ StreamingAccess deployed to:", streamingAccessAddress);

  // 4. Deploy MusicMarketplace
  console.log("\nDeploying MusicMarketplace...");
  const MusicMarketplace = await ethers.getContractFactory("MusicMarketplace");
  const marketplace = await MusicMarketplace.deploy(
    bsdTokenAddress,
    musicNFTAddress,
    streamingAccessAddress,
    platformWallet
  );
  await marketplace.waitForDeployment();
  const marketplaceAddress = await marketplace.getAddress();
  console.log("✓ MusicMarketplace deployed to:", marketplaceAddress);

  // 5. Setup permissions
  console.log("\n Setting up permissions...");

  // Grant marketplace role to marketplace contract
  const MARKETPLACE_ROLE = await streamingAccess.MARKETPLACE_ROLE();
  await streamingAccess.grantRole(MARKETPLACE_ROLE, marketplaceAddress);
  console.log("✓ Granted MARKETPLACE_ROLE to marketplace contract");

  // Exclude marketplace from BSD fees
  await bsdToken.excludeFromFee(marketplaceAddress, true);
  console.log("✓ Excluded marketplace from BSD token fees");

  // Summary
  console.log("\n" + "=".repeat(60));
  console.log("DEPLOYMENT SUMMARY");
  console.log("=".repeat(60));
  console.log("BSDToken:         ", bsdTokenAddress);
  console.log("MusicNFT:         ", musicNFTAddress);
  console.log("StreamingAccess:  ", streamingAccessAddress);
  console.log("MusicMarketplace: ", marketplaceAddress);
  console.log("Platform Wallet:  ", platformWallet);
  console.log("=".repeat(60));

  // Save deployment addresses
  const fs = require("fs");
  const deploymentInfo = {
    network: hre.network.name,
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    contracts: {
      BSDToken: bsdTokenAddress,
      MusicNFT: musicNFTAddress,
      StreamingAccess: streamingAccessAddress,
      MusicMarketplace: marketplaceAddress,
    },
    platformWallet: platformWallet,
  };

  fs.writeFileSync(
    "deployment.json",
    JSON.stringify(deploymentInfo, null, 2)
  );
  console.log("\n✓ Deployment info saved to deployment.json");

  // Verify contracts (if on a supported network)
  if (hre.network.name !== "hardhat" && hre.network.name !== "localhost") {
    console.log("\nWaiting for block confirmations...");
    await bsdToken.deploymentTransaction().wait(6);

    console.log("\nVerifying contracts on Etherscan...");
    try {
      await hre.run("verify:verify", {
        address: bsdTokenAddress,
        constructorArguments: [initialSupply],
      });
      console.log("✓ BSDToken verified");
    } catch (error) {
      console.log("Error verifying BSDToken:", error.message);
    }

    try {
      await hre.run("verify:verify", {
        address: musicNFTAddress,
        constructorArguments: [],
      });
      console.log("✓ MusicNFT verified");
    } catch (error) {
      console.log("Error verifying MusicNFT:", error.message);
    }

    try {
      await hre.run("verify:verify", {
        address: streamingAccessAddress,
        constructorArguments: [],
      });
      console.log("✓ StreamingAccess verified");
    } catch (error) {
      console.log("Error verifying StreamingAccess:", error.message);
    }

    try {
      await hre.run("verify:verify", {
        address: marketplaceAddress,
        constructorArguments: [
          bsdTokenAddress,
          musicNFTAddress,
          streamingAccessAddress,
          platformWallet,
        ],
      });
      console.log("✓ MusicMarketplace verified");
    } catch (error) {
      console.log("Error verifying MusicMarketplace:", error.message);
    }
  }

  console.log("\n🎉 Deployment complete!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
