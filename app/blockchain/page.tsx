"use client";

import { useState } from "react";
import { ethers } from "ethers";
import { getContract } from "@/lib/contract";

export default function Page() {
  const [account, setAccount] = useState<string | null>(null);

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("Install MetaMask");
      return;
    }

    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    setAccount(accounts[0]);
  };

  const createShipment = async () => {
    try {
      const contract = await getContract();

      const tx = await contract.createShipment(
        1,
        600,
        { value: ethers.parseEther("0.01") }
      );

      await tx.wait();
      alert("Shipment created successfully!");
    } catch (error) {
      console.error(error);
      alert("Transaction failed");
    }
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>ColdChain Blockchain Integration</h1>

      <button onClick={connectWallet}>
        {account ? "Connected" : "Connect Wallet"}
      </button>

      <br /><br />

      <button onClick={createShipment}>
        Create Shipment
      </button>
    </div>
  );
}
