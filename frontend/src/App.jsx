import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import contractJson from './artifacts/contracts/WaterBill.sol/WaterBill.json';

import "./App.css";

const contractAddress = "0xE8f47e4039FEe656d7CC5717Dd35d850E93d0156"; // Your deployed address
const contractABI = contractJson.abi;
//D:\WATER_BILL_MANAGEMENT_DAPP\Water_bill_management\src\artifacts\contracts\WaterBill.sol\WaterBill.json
const App = () => {
    const [account, setAccount] = useState("");
    const [contract, setContract] = useState(null);
    const [billAmount, setBillAmount] = useState("");
    const [userBill, setUserBill] = useState(null);

    useEffect(() => {
        connectWallet();
    }, []);

    const connectWallet = async () => {
        if (window.ethereum) {
            try {
                const provider = new ethers.BrowserProvider(window.ethereum);
                await window.ethereum.request({ method: "eth_requestAccounts" });
                const signer = await provider.getSigner();
                const userAddress = await signer.getAddress();
                setAccount(userAddress);

                const waterBillContract = new ethers.Contract(contractAddress, contractABI, signer);
                setContract(waterBillContract);

                fetchBill(waterBillContract);
            } catch (err) {
                console.error("Wallet connection failed", err);
            }
        } else {
            alert("Please install MetaMask.");
        }
    };

    const generateBill = async () => {
        if (!contract) return alert("Connect to wallet first!");
        try {
            const tx = await contract.generateBill(ethers.parseEther(billAmount));
            await tx.wait();
            alert("Bill generated!");
            fetchBill(contract);
        } catch (err) {
            console.error(err);
            alert("Error generating bill.");
        }
    };

    const payBill = async () => {
        if (!contract) return alert("Connect to wallet first!");
        try {
            const tx = await contract.payBill({ value: ethers.parseEther(billAmount) });
            await tx.wait();
            alert("Bill paid!");
            fetchBill(contract);
        } catch (err) {
            console.error(err);
            alert("Payment failed.");
        }
    };

    const fetchBill = async (instance = contract) => {
        if (!instance) return;
        try {
            const bill = await instance.getMyBill();
            setUserBill({
                amount: ethers.formatEther(bill[0]),
                paid: bill[1],
            });
        } catch (err) {
            console.error(err);
            alert("Could not fetch your bill.");
        }
    };

    return (
        <div className="container">
            <h2>💧 Water Bill dApp</h2>

            <p><strong>Connected Account:</strong> {account}</p>

            <div className="section">
                <h3>📤 Generate Your Bill</h3>
                <input
                    type="number"
                    placeholder="Enter bill amount (ETH)"
                    value={billAmount}
                    onChange={(e) => setBillAmount(e.target.value)}
                />
                <button onClick={generateBill} className="button">Generate Bill</button>
            </div>

            <div className="section">
                <h3>💰 Pay Your Bill</h3>
                <input
                    type="number"
                    placeholder="Enter payment amount (ETH)"
                    value={billAmount}
                    onChange={(e) => setBillAmount(e.target.value)}
                />
                <button onClick={payBill} className="button">Pay Bill</button>
            </div>

            <div className="section">
                <h3>📜 Your Bill Info</h3>
                <button onClick={() => fetchBill()} className="button">Refresh</button>
                {userBill && (
                    <p>
                        <strong>Amount:</strong> {userBill.amount} ETH<br />
                        <strong>Status:</strong> {userBill.paid ? "✅ Paid" : "❌ Unpaid"}
                    </p>
                )}
            </div>
        </div>
    );
};

export default App;
