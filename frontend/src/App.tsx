import { useEffect, useState } from "react";
import { BrowserProvider, Contract, formatUnits, parseUnits } from "ethers";
import {
  TOKEN_ADDRESS,
  TOKEN_ABI,
  VAULT_ADDRESS,
  VAULT_ABI,
} from "./contracts";

type EthWindow = typeof window & { ethereum?: any };

export function App() {
  const [account, setAccount] = useState<string>("");
  const [symbol, setSymbol] = useState<string>("TKN");
  const [decimals, setDecimals] = useState<number>(18);
  const [walletBalance, setWalletBalance] = useState<string>("0");
  const [vaultBalance, setVaultBalance] = useState<string>("0");
  const [amount, setAmount] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [busy, setBusy] = useState<boolean>(false);

  const hasWallet = typeof window !== "undefined" && Boolean((window as EthWindow).ethereum);

  async function getProvider() {
    const eth = (window as EthWindow).ethereum;
    if (!eth) throw new Error("Carteira nao encontrada. Instale o MetaMask.");
    return new BrowserProvider(eth);
  }

  async function connect() {
    try {
      setBusy(true);
      const provider = await getProvider();
      const accounts = await provider.send("eth_requestAccounts", []);
      setAccount(accounts[0]);
      setStatus("");
    } catch (err: any) {
      setStatus(err.message ?? String(err));
    } finally {
      setBusy(false);
    }
  }

  async function refresh() {
    if (!account) return;
    try {
      const provider = await getProvider();
      const token = new Contract(TOKEN_ADDRESS, TOKEN_ABI, provider);
      const vault = new Contract(VAULT_ADDRESS, VAULT_ABI, provider);

      const [sym, dec] = await Promise.all([token.symbol(), token.decimals()]);
      const d = Number(dec);
      const [wb, vb] = await Promise.all([
        token.balanceOf(account),
        vault.balanceOf(account),
      ]);

      setSymbol(sym);
      setDecimals(d);
      setWalletBalance(formatUnits(wb, d));
      setVaultBalance(formatUnits(vb, d));
    } catch (err: any) {
      setStatus(err.message ?? String(err));
    }
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account]);

  async function deposit() {
    if (!amount) return;
    try {
      setBusy(true);
      setStatus("Aprovando...");
      const provider = await getProvider();
      const signer = await provider.getSigner();
      const token = new Contract(TOKEN_ADDRESS, TOKEN_ABI, signer);
      const vault = new Contract(VAULT_ADDRESS, VAULT_ABI, signer);
      const value = parseUnits(amount, decimals);

      const approveTx = await token.approve(VAULT_ADDRESS, value);
      await approveTx.wait();

      setStatus("Depositando...");
      const depositTx = await vault.deposit(value);
      await depositTx.wait();

      setStatus("Deposito concluido.");
      setAmount("");
      await refresh();
    } catch (err: any) {
      setStatus(err.message ?? String(err));
    } finally {
      setBusy(false);
    }
  }

  async function withdraw() {
    if (!amount) return;
    try {
      setBusy(true);
      setStatus("Sacando...");
      const provider = await getProvider();
      const signer = await provider.getSigner();
      const vault = new Contract(VAULT_ADDRESS, VAULT_ABI, signer);
      const value = parseUnits(amount, decimals);

      const tx = await vault.withdraw(value);
      await tx.wait();

      setStatus("Saque concluido.");
      setAmount("");
      await refresh();
    } catch (err: any) {
      setStatus(err.message ?? String(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <main style={{ fontFamily: "system-ui, sans-serif", maxWidth: 560, margin: "40px auto", padding: 24 }}>
      <h1>crypto-web3 · Vault dApp</h1>
      <p style={{ color: "#666" }}>
        Deposite e saque tokens ERC-20 no contrato Vault usando ethers.js.
      </p>

      {!hasWallet && (
        <p style={{ color: "#b00" }}>Nenhuma carteira detectada. Instale o MetaMask para continuar.</p>
      )}

      {!account ? (
        <button onClick={connect} disabled={!hasWallet || busy}>
          Conectar carteira
        </button>
      ) : (
        <div>
          <p><b>Conta:</b> {account}</p>
          <ul>
            <li>Saldo na carteira: {walletBalance} {symbol}</li>
            <li>Saldo no Vault: {vaultBalance} {symbol}</li>
          </ul>

          <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
            <input
              type="number"
              placeholder={`Valor em ${symbol}`}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              style={{ flex: 1, padding: 8 }}
            />
            <button onClick={deposit} disabled={busy}>Depositar</button>
            <button onClick={withdraw} disabled={busy}>Sacar</button>
          </div>

          <button onClick={refresh} disabled={busy} style={{ marginTop: 12 }}>
            Atualizar saldos
          </button>
        </div>
      )}

      {status && <p style={{ marginTop: 16 }}>{status}</p>}
    </main>
  );
}
