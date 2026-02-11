import { readFileSync } from "fs";
import { ethers } from "ethers";
import dotenv from "dotenv";

dotenv.config();

async function main() {
  const artifact = JSON.parse(
    readFileSync("./artifacts/contracts/ColdChain.sol/ColdChain.json")
  );

  const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

  const factory = new ethers.ContractFactory(
    artifact.abi,
    artifact.bytecode,
    wallet
  );

  console.log("Deploying contract...");

  const contract = await factory.deploy();
  await contract.waitForDeployment();

  console.log("Contract deployed to:", await contract.getAddress());
}

main().catch(console.error);

