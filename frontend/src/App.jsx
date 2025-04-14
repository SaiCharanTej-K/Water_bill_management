import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import "./App.css";
import WaterBillManagerABI from "./artifacts/contracts/Water Bill Management Smart Contract.sol/WaterBillManager.json"; // Add your ABI file here

const contractAddress = "0x2ef14f566AD247E5F87C8ba9878fF957A1aD992A"; // Replace with your deployed contract address

function App() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState("");
  const [usage, setUsage] = useState(0);
  const [due, setDue] = useState(0);
  const [status, setStatus] = useState("");

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        const newProvider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(newProvider);

        const newSigner = newProvider.getSigner();
        setSigner(newSigner);

        const instance = new ethers.Contract(
          contractAddress,
          WaterBillManagerABI,
          newSigner
        );
        setContract(instance);
      }
    };

    init();
  }, []);

  const connectWallet = async () => {
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    setAccount(accounts[0]);
    setStatus("Wallet connected.");
  };

  const fetchBill = async () => {
    try {
      const [userUsage, userDue] = await contract.viewBill();
      setUsage(Number(userUsage));
      setDue(ethers.utils.formatEther(userDue));
      setStatus("Bill fetched.");
    } catch (error) {
      console.error(error);
      setStatus("Error fetching bill. Are you registered?");
    }
  };

  const payBill = async () => {
    try {
      const amountInWei = ethers.utils.parseEther(due);
      const tx = await contract.payBill({ value: amountInWei });
      await tx.wait();
      setStatus("Payment successful!");
      fetchBill();
    } catch (error) {
      console.error(error);
      setStatus("Payment failed.");
    }
  };

  return (
    <div className="app">
      <h1>💧 Water Bill Manager</h1>
      <button onClick={connectWallet}>Connect Wallet</button>
      <p><strong>Account:</strong> {account}</p>

      <button onClick={fetchBill}>View My Bill</button>

      <div className="bill-info">
        <p><strong>Water Usage:</strong> {usage} liters</p>
        <p><strong>Amount Due:</strong> {due} ETH</p>
      </div>

      <button onClick={payBill} disabled={due === "0"}>Pay Bill</button>

      <p className="status">{status}</p>
    </div>
  );
}

export default App;
