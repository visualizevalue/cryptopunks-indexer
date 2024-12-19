import { createConfig } from "ponder";
import { http } from "viem";

import { UnverifiedContractAbi } from "./abis/UnverifiedContractAbi";

export default createConfig({
  networks: {
    mainnet: { chainId: 1, transport: http(process.env.PONDER_RPC_URL_1) },
  },
  contracts: {
    UnverifiedContract: {
      abi: UnverifiedContractAbi,
      address: "0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb",
      network: "mainnet",
    },
  },
});
