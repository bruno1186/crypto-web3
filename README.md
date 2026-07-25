# crypto-web3

[![CI](https://github.com/bruno1186/crypto-web3/actions/workflows/ci.yml/badge.svg)](https://github.com/bruno1186/crypto-web3/actions/workflows/ci.yml)
![Solidity](https://img.shields.io/badge/Solidity-0.8.24-363636)
![Hardhat](https://img.shields.io/badge/Hardhat-2.x-fff100)

Projeto Web3 de referência com smart contracts em Solidity, ambiente de desenvolvimento Hardhat e um dApp de exemplo integrado via ethers.js. Segue as principais práticas de mercado para desenvolvimento blockchain, incluindo testes automatizados e CI.

## Tecnologias

- **Solidity** (0.8.24) com **OpenZeppelin Contracts** (ERC-20, SafeERC20, ReentrancyGuard)
- **Hardhat** — compilação, testes e deploy
- **ethers.js v6** — integração do dApp com a blockchain
- **Chai / Mocha** — testes de contrato
- **React + Vite** — dApp de exemplo

## Contratos

- **Token.sol** — token ERC-20 (`CW3`) com mint restrito ao owner.
- **Vault.sol** — cofre de depósito/saque de um token ERC-20, com `SafeERC20`, `ReentrancyGuard`, custom errors e eventos, seguindo checks-effects-interactions.

## Estrutura de pastas

```
crypto-web3/
├── contracts/        # smart contracts em Solidity (Token, Vault)
├── scripts/          # scripts de deploy
├── test/             # testes dos contratos (Token, Vault)
├── frontend/         # dApp (React + Vite + ethers.js)
├── hardhat.config.ts
└── package.json
```

## Como rodar os contratos

```bash
npm install
npx hardhat compile        # compila os contratos
npx hardhat test           # executa os testes
npx hardhat node           # sobe uma blockchain local
npx hardhat run scripts/deploy.ts --network localhost   # deploy local
```

## dApp (frontend)

O dApp permite conectar a carteira (MetaMask), consultar saldos e depositar/sacar tokens no contrato Vault.

```bash
cd frontend
npm install
cp .env.example .env       # preencha os enderecos exibidos no deploy
npm run dev                # abre em http://localhost:5173
```

Os endereços dos contratos são lidos de `VITE_TOKEN_ADDRESS` e `VITE_VAULT_ADDRESS` (veja `frontend/.env.example`), com fallback para os endereços padrão de deploy local do Hardhat.

## Segurança

Repositório para fins de estudo e referência. **Nunca** faça commit de chaves privadas ou seeds — use variáveis de ambiente (`.env`) mantidas no `.gitignore`.

## CI

O workflow em `.github/workflows/ci.yml` instala as dependências, compila os contratos e roda os testes a cada push e pull request.

## Licença

MIT
