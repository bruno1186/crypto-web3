// Enderecos dos contratos apos o deploy local (npx hardhat run scripts/deploy.ts).
// Ajuste conforme a saida do seu deploy ou use variaveis de ambiente do Vite.
export const TOKEN_ADDRESS =
  (import.meta.env.VITE_TOKEN_ADDRESS as string) ??
  "0x5FbDB2315678afecb367f032d93F642f64180aa3";

export const VAULT_ADDRESS =
  (import.meta.env.VITE_VAULT_ADDRESS as string) ??
  "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

// ABIs minimas (apenas o necessario para o dApp).
export const TOKEN_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function balanceOf(address) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
] as const;

export const VAULT_ABI = [
  "function token() view returns (address)",
  "function balanceOf(address) view returns (uint256)",
  "function totalDeposited() view returns (uint256)",
  "function deposit(uint256 amount)",
  "function withdraw(uint256 amount)",
  "event Deposited(address indexed account, uint256 amount)",
  "event Withdrawn(address indexed account, uint256 amount)",
] as const;
