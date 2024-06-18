'use client'

import React, {
  useState,
  useEffect,
  createContext,
  useContext,
  useCallback,
} from "react";
import detectEthereumProvider from "@metamask/detect-provider";
import { formatBalance } from "@/utils";

interface WalletState {
  accounts: string[];
  balance: string;
  chainId: string;
}

const disconnectedState: WalletState = {
  accounts: [],
  balance: "",
  chainId: "",
};

interface MetaMaskContextType {
  wallet: WalletState;
  hasProvider: boolean | null;
  error: boolean;
  errorMessage: string;
  isConnecting: boolean;
  connectMetaMask: () => Promise<void>;
}

const MetaMaskContext = createContext<MetaMaskContextType | null>(null);

export const MetaMaskContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [hasProvider, setHasProvider] = useState<boolean | null>(null);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [wallet, setWallet] = useState<WalletState>(disconnectedState);

  const _updateWallet = useCallback(async (providedAccounts?: string[]) => {
    const ethereum = (window as any).ethereum;
    if (!ethereum) {
      // Handle the case where ethereum provider is not available
      setWallet(disconnectedState);
      return;
    }

    const accounts =
      providedAccounts ||
      (await ethereum.request({ method: "eth_accounts" }));

    if (accounts.length === 0) {
      setWallet(disconnectedState);
      return;
    }

    const balance = formatBalance(
      await ethereum.request({
        method: "eth_getBalance",
        params: [accounts[0], "latest"],
      })
    );
    const chainId = await ethereum.request({
      method: "eth_chainId",
    });

    setWallet({ accounts, balance, chainId });
  }, []);

  const updateWalletAndAccounts = useCallback(() => _updateWallet(), [
    _updateWallet,
  ]);
  const updateWallet = useCallback(
    (accounts: string[]) => _updateWallet(accounts),
    [_updateWallet]
  );

  useEffect(() => {
    const getProvider = async () => {
      try {
        const provider = await detectEthereumProvider({ silent: true });
        setHasProvider(Boolean(provider));

        if (provider) {
          updateWalletAndAccounts();
          (window as any).ethereum.on("accountsChanged", updateWallet);
          (window as any).ethereum.on("chainChanged", updateWalletAndAccounts);
        }
      } catch (err) {
        console.error(err);
      }
    };

    getProvider();

    return () => {
      (window as any).ethereum?.removeListener("accountsChanged", updateWallet);
      (window as any).ethereum?.removeListener(
        "chainChanged",
        updateWalletAndAccounts
      );
    };
  }, [updateWallet, updateWalletAndAccounts]);

  const connectMetaMask = async () => {
    setIsConnecting(true);

    try {
      const accounts = await (window as any).ethereum.request({
        method: "eth_requestAccounts",
      });
      setErrorMessage("");
      updateWallet(accounts);
    } catch (err) {
      console.error(err);
      setErrorMessage((err as Error).message);
    }
    setIsConnecting(false);
  };

  const contextValue: MetaMaskContextType = {
    wallet,
    hasProvider: !!hasProvider,
    error: !!errorMessage,
    errorMessage,
    isConnecting,
    connectMetaMask,
  };

  return (
    <MetaMaskContext.Provider value={contextValue}>
      {children}
    </MetaMaskContext.Provider>
  );
};

export const useMetaMask = (): MetaMaskContextType => {
  const context = useContext(MetaMaskContext);
  if (!context) {
    throw new Error(
      "useMetaMask must be used within a MetaMaskContextProvider"
    );
  }
  return context;
};