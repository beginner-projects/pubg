'use client';

import React from 'react';
import Web3 from 'web3';
import './index.css';
import ContractABI from '@/lib/ContractABI.json';
import TokenABI from '@/lib/TokenABI.json';
import { useMetaMask } from '@/context/useMetaMask';

const FeeBtn: React.FC = () => {
    const contractAddress = "0xAFfAc0C0779c995AD9E5b193433B55EFAeCC8b0e";
    const tokenAddress = "0x0B3C24423F40aDf2A0CADcB9880cF0436a79dc38";
    const { wallet } = useMetaMask();

    const handleDeposit = async () => {
        if (wallet) {
            const web3 = new Web3((window as any).ethereum); // Use the MetaMask provider
            try {
                // Request accounts access if needed
                await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
                const accounts = await web3.eth.getAccounts();
                const account = accounts[0];
                const contract = new web3.eth.Contract(ContractABI, contractAddress);
                const tokenContract = new web3.eth.Contract(TokenABI, tokenAddress);

                const entryFee = await contract.methods.entryFee().call();

                // Step 1: Approve
                console.log('Approval in progress...');
                await tokenContract.methods.approve(contractAddress, entryFee).send({ from: account });
                console.log('Approval successful!');

                // Step 2: Deposit
                console.log('Deposit in progress...');
                await contract.methods.deposit().send({ from: account });
                console.log('Deposit successful!');

                alert('Deposit successful!');
            } catch (error) {
                console.error('An error occurred:', error);
                alert('An error occurred while processing your deposit.');
            }
        } else {
            alert('Please install MetaMask to use this dApp!');
        }
    };

    return (
        <button className="button-29" role="button" onClick={handleDeposit}>
            Entry Fee: 10 USDT
        </button>
    );
};

export default FeeBtn;
