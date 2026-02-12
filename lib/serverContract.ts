import { ethers } from "ethers";

const contractAddress = "0xd197ca8876ff54C56065beDD18C87c79Fe60EECf";
const abi = [
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "shipmentId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "breachDuration",
          "type": "uint256"
        }
      ],
      "name": "BreachDetected",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "shipmentId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "penaltyAmount",
          "type": "uint256"
        }
      ],
      "name": "PenaltyExecuted",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "shipmentId",
          "type": "uint256"
        }
      ],
      "name": "ShipmentCreated",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "shipmentId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "maxBreachDuration",
          "type": "uint256"
        }
      ],
      "name": "createShipment",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "shipmentId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "breachDuration",
          "type": "uint256"
        }
      ],
      "name": "reportCompliance",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "shipments",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "maxBreachDuration",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "escrowAmount",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "logisticsPartner",
          "type": "address"
        },
        {
          "internalType": "bool",
          "name": "active",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ];

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);

export const serverContract = new ethers.Contract(
  contractAddress,
  abi,
  wallet
);
