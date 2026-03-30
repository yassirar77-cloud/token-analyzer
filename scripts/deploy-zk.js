const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("Starting ZK Privacy contracts deployment...\n");

  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  console.log(
    "Account balance:",
    ethers.formatEther(await ethers.provider.getBalance(deployer.address)),
    "ETH\n"
  );

  // Load existing deployment info if available
  let existingDeployment = {};
  const deploymentPath = path.resolve(__dirname, "../deployment.json");
  if (fs.existsSync(deploymentPath)) {
    existingDeployment = JSON.parse(fs.readFileSync(deploymentPath, "utf8"));
    console.log("Found existing deployment info");
    console.log(
      "BSDToken:",
      existingDeployment.contracts?.BSDToken || "NOT DEPLOYED"
    );
  }

  // ============================================
  // 1. Deploy Groth16 Verifiers (auto-generated from snarkjs)
  // ============================================

  // Deploy StreamingVerifier
  console.log("\nDeploying StreamingVerifier...");
  let streamingVerifierAddress;
  try {
    const StreamingVerifier = await ethers.getContractFactory(
      "StreamingGroth16Verifier"
    );
    const streamingVerifier = await StreamingVerifier.deploy();
    await streamingVerifier.waitForDeployment();
    streamingVerifierAddress = await streamingVerifier.getAddress();
    console.log("✓ StreamingVerifier deployed to:", streamingVerifierAddress);
  } catch (error) {
    console.log(
      "⚠ StreamingVerifier not deployed (compile circuits first):",
      error.message
    );
    streamingVerifierAddress = ethers.ZeroAddress;
  }

  // Deploy TransferVerifier
  console.log("\nDeploying TransferVerifier...");
  let transferVerifierAddress;
  try {
    const TransferVerifier = await ethers.getContractFactory(
      "TransferGroth16Verifier"
    );
    const transferVerifier = await TransferVerifier.deploy();
    await transferVerifier.waitForDeployment();
    transferVerifierAddress = await transferVerifier.getAddress();
    console.log("✓ TransferVerifier deployed to:", transferVerifierAddress);
  } catch (error) {
    console.log(
      "⚠ TransferVerifier not deployed (compile circuits first):",
      error.message
    );
    transferVerifierAddress = ethers.ZeroAddress;
  }

  // ============================================
  // 2. Deploy BSDPrivateIdentity (Semaphore-based)
  // ============================================
  console.log("\nDeploying BSDPrivateIdentity...");
  let bsdPrivateIdentityAddress;
  try {
    // Semaphore contract address — use existing deployment or deploy new
    // On Base mainnet, check if Semaphore is already deployed
    const semaphoreAddress =
      process.env.SEMAPHORE_ADDRESS || ethers.ZeroAddress;
    const groupId = process.env.SEMAPHORE_GROUP_ID || 1;

    const BSDPrivateIdentity = await ethers.getContractFactory(
      "BSDPrivateIdentity"
    );
    const bsdPrivateIdentity = await BSDPrivateIdentity.deploy(
      semaphoreAddress,
      groupId
    );
    await bsdPrivateIdentity.waitForDeployment();
    bsdPrivateIdentityAddress = await bsdPrivateIdentity.getAddress();
    console.log(
      "✓ BSDPrivateIdentity deployed to:",
      bsdPrivateIdentityAddress
    );
    console.log("  Semaphore address:", semaphoreAddress);
    console.log("  Group ID:", groupId);
  } catch (error) {
    console.log("⚠ BSDPrivateIdentity deployment failed:", error.message);
    bsdPrivateIdentityAddress = ethers.ZeroAddress;
  }

  // ============================================
  // 3. Deploy BSDPrivatePool
  // ============================================
  console.log("\nDeploying BSDPrivatePool...");
  let bsdPrivatePoolAddress;
  try {
    const bsdTokenAddress =
      existingDeployment.contracts?.BSDToken ||
      process.env.BSD_TOKEN_ADDRESS ||
      ethers.ZeroAddress;

    const BSDPrivatePool = await ethers.getContractFactory("BSDPrivatePool");
    const bsdPrivatePool = await BSDPrivatePool.deploy(
      transferVerifierAddress,
      bsdTokenAddress
    );
    await bsdPrivatePool.waitForDeployment();
    bsdPrivatePoolAddress = await bsdPrivatePool.getAddress();
    console.log("✓ BSDPrivatePool deployed to:", bsdPrivatePoolAddress);
    console.log("  Verifier:", transferVerifierAddress);
    console.log("  BSDToken:", bsdTokenAddress);
  } catch (error) {
    console.log("⚠ BSDPrivatePool deployment failed:", error.message);
    bsdPrivatePoolAddress = ethers.ZeroAddress;
  }

  // ============================================
  // Summary
  // ============================================
  console.log("\n" + "=".repeat(60));
  console.log("ZK PRIVACY DEPLOYMENT SUMMARY");
  console.log("=".repeat(60));
  console.log("StreamingVerifier:   ", streamingVerifierAddress);
  console.log("TransferVerifier:    ", transferVerifierAddress);
  console.log("BSDPrivateIdentity:  ", bsdPrivateIdentityAddress);
  console.log("BSDPrivatePool:      ", bsdPrivatePoolAddress);
  console.log("=".repeat(60));

  // Save ZK deployment info
  const zkDeploymentInfo = {
    network: hre.network.name,
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    contracts: {
      StreamingVerifier: streamingVerifierAddress,
      TransferVerifier: transferVerifierAddress,
      BSDPrivateIdentity: bsdPrivateIdentityAddress,
      BSDPrivatePool: bsdPrivatePoolAddress,
    },
  };

  fs.writeFileSync(
    path.resolve(__dirname, "../deployment-zk.json"),
    JSON.stringify(zkDeploymentInfo, null, 2)
  );
  console.log("\n✓ ZK deployment info saved to deployment-zk.json");
  console.log("\n🔒 ZK Privacy deployment complete!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
