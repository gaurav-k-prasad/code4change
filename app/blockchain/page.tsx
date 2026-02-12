"use client";

import { useState } from "react";
import { ethers } from "ethers";
import { getContract } from "@/lib/contract";

declare global {
  interface Window {
    ethereum?: any;
  }
}

export default function Page() {
  const [account, setAccount] = useState<string | null>(null);
  const [shipmentId, setShipmentId] = useState<number>(1);
  const [loading, setLoading] = useState(false);

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask");
      return;
    }

    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      const provider = new ethers.BrowserProvider(window.ethereum);
      const network = await provider.getNetwork();

      if (Number(network.chainId) !== 80002) {
        alert("Please switch to Polygon Amoy network (Chain ID 80002)");
        return;
      }

      setAccount(accounts[0]);
    } catch (error) {
      console.error(error);
    }
  };

  const createShipment = async () => {
    try {
      setLoading(true);
      const contract = await getContract();

      const tx = await contract.createShipment(
        shipmentId,
        600,
        { value: ethers.parseEther("0.01") }
      );

      await tx.wait();

      alert("Shipment created successfully!");
      setShipmentId(shipmentId + 1);
    } catch (error: any) {
      if (error.reason) alert(error.reason);
      else alert("Transaction failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>ColdChain</h1>
        <p style={styles.subtitle}>Blockchain Shipment Management</p>

        <button style={styles.walletBtn} onClick={connectWallet}>
          {account
            ? `Connected: ${account.slice(0, 6)}...${account.slice(-4)}`
            : "Connect Wallet"}
        </button>

        <div style={styles.divider} />

        <div style={styles.inputGroup}>
          <label style={styles.label}>Shipment ID</label>
          <input
            type="number"
            value={shipmentId}
            onChange={(e) => setShipmentId(Number(e.target.value))}
            style={styles.input}
          />
        </div>

        <button
          style={{
            ...styles.primaryBtn,
            opacity: !account || loading ? 0.6 : 1,
            cursor: !account || loading ? "not-allowed" : "pointer",
          }}
          onClick={createShipment}
          disabled={!account || loading}
        >
          {loading ? "Processing Transaction..." : "Create Shipment"}
        </button>

        {account && (
          <div style={styles.status}>
            🟢 Wallet Connected to Polygon Amoy
          </div>
        )}
      </div>
    </div>
  );
}

const styles: any = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0f172a, #1e293b)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "Inter, sans-serif",
  },
  card: {
    background: "rgba(255,255,255,0.05)",
    backdropFilter: "blur(12px)",
    padding: "40px",
    borderRadius: "20px",
    width: "400px",
    boxShadow: "0 20px 50px rgba(0,0,0,0.4)",
    border: "1px solid rgba(255,255,255,0.1)",
    color: "white",
  },
  title: {
    fontSize: "28px",
    fontWeight: "600",
    marginBottom: "5px",
  },
  subtitle: {
    fontSize: "14px",
    opacity: 0.7,
    marginBottom: "25px",
  },
  walletBtn: {
    width: "100%",
    padding: "12px",
    borderRadius: "10px",
    border: "none",
    background: "#6366f1",
    color: "white",
    fontWeight: "600",
    cursor: "pointer",
    marginBottom: "20px",
  },
  divider: {
    height: "1px",
    background: "rgba(255,255,255,0.1)",
    margin: "20px 0",
  },
  inputGroup: {
    marginBottom: "20px",
  },
  label: {
    fontSize: "14px",
    marginBottom: "6px",
    display: "block",
    opacity: 0.8,
  },
  input: {
    width: "100%",
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid rgba(255,255,255,0.2)",
    background: "rgba(255,255,255,0.08)",
    color: "white",
    outline: "none",
  },
  primaryBtn: {
    width: "100%",
    padding: "14px",
    borderRadius: "12px",
    border: "none",
    background: "linear-gradient(90deg, #22d3ee, #6366f1)",
    color: "white",
    fontWeight: "600",
    fontSize: "16px",
    transition: "0.3s",
  },
  status: {
    marginTop: "20px",
    fontSize: "13px",
    opacity: 0.8,
  },
};
