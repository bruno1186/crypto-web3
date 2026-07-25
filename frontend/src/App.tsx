import { useAccount, useConnect, useDisconnect } from 'wagmi';

export function App() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  return (
    <main style={{ fontFamily: 'sans-serif', padding: 32 }}>
      <h1>crypto-web3 dApp</h1>
      {isConnected ? (
        <div>
          <p>Conectado: {address}</p>
          <button onClick={() => disconnect()}>Desconectar</button>
        </div>
      ) : (
        <div>
          {connectors.map((connector) => (
            <button key={connector.uid} onClick={() => connect({ connector })}>
              Conectar com {connector.name}
            </button>
          ))}
        </div>
      )}
    </main>
  );
}
