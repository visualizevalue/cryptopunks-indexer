import { createConfig } from 'ponder'
import { fallback, http } from 'viem'

import { CryptoPunksAbi, CryptoPunksAddress } from './abis/CryptoPunksAbi'

export default createConfig({
  networks: {
    mainnet: {
      chainId: 1,
      transport: fallback([
        http(process.env.PONDER_RPC_URL_1_1),
        http(process.env.PONDER_RPC_URL_1_2),
        http(process.env.PONDER_RPC_URL_1_3),
      ]),
    },
  },
  contracts: {
    CryptoPunks: {
      abi: CryptoPunksAbi,
      address: CryptoPunksAddress,
      network: 'mainnet',
      startBlock: 3914495,
    },
  },
})

