# crypto-web3

Projeto Web3 de referencia com smart contracts em Solidity, ambiente de desenvolvimento Hardhat e um dApp de exemplo integrado via Ethers.js. Segue as principais praticas de mercado para desenvolvimento blockchain.

## Tecnologias

- Solidity
- - Hardhat (compilacao, testes e deploy)
  - - Ethers.js
    - - OpenZeppelin Contracts (padroes ERC-20, ERC-721)
      - - TypeChain (tipagem para contratos)
        - - Chai / Mocha para testes de contrato
          - - React + Vite + wagmi para o dApp
            - - TypeScript
             
              - ## Estrutura de pastas
             
              - ```
                crypto-web3/
                  contracts/        # smart contracts em Solidity
                  scripts/          # scripts de deploy
                  test/             # testes dos contratos
                  frontend/         # dApp (React + wagmi)
                  hardhat.config.ts
                  package.json
                ```

                ## Como rodar localmente

                ```bash
                # instalar dependencias
                npm install

                # compilar contratos
                npx hardhat compile

                # rodar testes
                npx hardhat test

                # subir node local
                npx hardhat node

                # deploy na rede local
                npx hardhat run scripts/deploy.ts --network localhost
                ```

                ## dApp

                ```bash
                cd frontend
                npm install
                npm run dev
                ```

                ## Seguranca

                Este repositorio e para fins de estudo e referencia. Nunca faca commit de chaves privadas ou seeds. Use variaveis de ambiente (.env) e mantenha o arquivo no .gitignore.

                ## Scripts principais

                - `npx hardhat compile` - compila os contratos
                - - `npx hardhat test` - executa os testes
                  - - `npx hardhat node` - inicia blockchain local
                    - - `npm run lint` - analise estatica
                     
                      - ## Licenca
                     
                      - MIT
                      - 
