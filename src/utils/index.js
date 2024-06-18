export const formatBalance = (rawBalance) => {
  const balance = (parseInt(rawBalance) / 1000000000000000000).toFixed(2);
  return balance;
};

// balance in btc
export const formatBalanceEight = (rawBalance) => {
  const balance = (parseInt(rawBalance) / 1000000000000000000).toFixed(8);
  return balance;
};

// balance in smallest unit of  bitcoin - satoshi
export const formatBitcoinBalanceInSats = (rawBalance) => {
  const balance = (parseInt(rawBalance) / 1000000000000000000).toFixed(8) * 1e8;
  return balance;
};

export const formatChainAsNum = (chainIdHex) => {
  const chainIdNum = parseInt(chainIdHex);
  return chainIdNum;
};

export const formatAddress = (addr) => {
  return `${addr.substring(0, 5)}...${addr.substring(addr.length - 5)}`;
};
