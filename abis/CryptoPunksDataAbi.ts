export const CryptoPunksDataAddress = `0x16F5A35647D6F03D5D3da7b35409D65ba03aF3B2`

export const CryptoPunksDataAbi = [
  {
    "inputs": [
      {
        "internalType": "uint16",
        "name": "index",
        "type": "uint16"
      }
    ],
    "name": "punkAttributes",
    "outputs": [
      {
        "internalType": "string",
        "name": "attributes",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint16",
        "name": "index",
        "type": "uint16"
      }
    ],
    "name": "punkImageSvg",
    "outputs": [
      {
        "internalType": "string",
        "name": "svg",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const
