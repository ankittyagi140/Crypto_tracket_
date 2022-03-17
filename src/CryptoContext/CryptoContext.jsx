import { useState, createContext, useContext, useEffect } from "react";
const Crypto = createContext();

const CryptoContext = ({ children }) => {
  const [currency, setCurrency] = useState("USD");
  const [symbol, setSymbol] = useState("$");
  useEffect(() => {
    if (currency === "INR") {
      setSymbol("RS");
    } else if (currency === "USD") {
      setSymbol("$");
    }
  }, [currency]);
  return <Crypto.Provider value={{currency,symbol,setCurrency}}>{children}</Crypto.Provider>;
};
export default CryptoContext;

export const CryptoState = () => {
  return useContext(Crypto);
};
