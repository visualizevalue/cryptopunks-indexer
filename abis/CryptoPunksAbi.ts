export const CryptoPunksAddress = `0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb`

export const CryptoPunksAbi = [
  {
    "name": "punksOfferedForSale",
    "type": "function",
    "stateMutability": "nonpayable",
    "inputs": [
      {
        "type": "uint256"
      }
    ],
    "outputs": [
      {
        "type": "bool",
        "name": "isForSale"
      },
      {
        "type": "uint256",
        "name": "punkIndex"
      },
      {
        "type": "address",
        "name": "seller"
      },
      {
        "type": "uint256",
        "name": "minValue"
      },
      {
        "type": "address",
        "name": "onlySellTo"
      }
    ]
  },
  {
    "name": "totalSupply",
    "type": "function",
    "stateMutability": "nonpayable",
    "inputs": [],
    "outputs": [
      {
        "type": "uint256"
      }
    ]
  },
  {
    "name": "punkIndexToAddress",
    "type": "function",
    "stateMutability": "nonpayable",
    "inputs": [
      {
        "type": "uint256"
      }
    ],
    "outputs": [
      {
        "type": "address"
      }
    ]
  },
  {
    "name": "punkBids",
    "type": "function",
    "stateMutability": "nonpayable",
    "inputs": [
      {
        "type": "uint256"
      }
    ],
    "outputs": [
      {
        "type": "bool",
        "name": "hasBid"
      },
      {
        "type": "uint256",
        "name": "punkIndex"
      },
      {
        "type": "address",
        "name": "bidder"
      },
      {
        "type": "uint256",
        "name": "value"
      }
    ]
  },
  {
    "name": "balanceOf",
    "type": "function",
    "stateMutability": "nonpayable",
    "inputs": [
      {
        "type": "address"
      }
    ],
    "outputs": [
      {
        "type": "uint256"
      }
    ]
  },
  {
    "name": "allPunksAssigned",
    "type": "function",
    "stateMutability": "nonpayable",
    "inputs": [],
    "outputs": [
      {
        "type": "bool"
      }
    ]
  },
  {
    "name": "punksRemainingToAssign",
    "type": "function",
    "stateMutability": "nonpayable",
    "inputs": [],
    "outputs": [
      {
        "type": "uint256"
      }
    ]
  },
  {
    "name": "getPunk",
    "type": "function",
    "stateMutability": "nonpayable",
    "inputs": [
      {
        "type": "uint256",
        "name": "punkIndex"
      }
    ],
    "outputs": []
  },
  {
    "name": "pendingWithdrawals",
    "type": "function",
    "stateMutability": "nonpayable",
    "inputs": [
      {
        "type": "address"
      }
    ],
    "outputs": [
      {
        "type": "uint256"
      }
    ]
  },
  {
    "name": "Assign",
    "type": "event",
    "inputs": [
      {
        "type": "address",
        "name": "to",
        "indexed": true
      },
      {
        "type": "uint256",
        "name": "punkIndex"
      }
    ]
  },
  {
    "name": "Transfer",
    "type": "event",
    "inputs": [
      {
        "type": "address",
        "name": "from",
        "indexed": true
      },
      {
        "type": "address",
        "name": "to",
        "indexed": true
      },
      {
        "type": "uint256",
        "name": "value"
      }
    ]
  },
  {
    "name": "PunkTransfer",
    "type": "event",
    "inputs": [
      {
        "type": "address",
        "name": "from",
        "indexed": true
      },
      {
        "type": "address",
        "name": "to",
        "indexed": true
      },
      {
        "type": "uint256",
        "name": "punkIndex"
      }
    ]
  },
  {
    "name": "PunkOffered",
    "type": "event",
    "inputs": [
      {
        "type": "uint256",
        "name": "punkIndex",
        "indexed": true
      },
      {
        "type": "uint256",
        "name": "minValue"
      },
      {
        "type": "address",
        "name": "toAddress",
        "indexed": true
      }
    ]
  },
  {
    "name": "PunkBidEntered",
    "type": "event",
    "inputs": [
      {
        "type": "uint256",
        "name": "punkIndex",
        "indexed": true
      },
      {
        "type": "uint256",
        "name": "value"
      },
      {
        "type": "address",
        "name": "fromAddress",
        "indexed": true
      }
    ]
  },
  {
    "name": "PunkBidWithdrawn",
    "type": "event",
    "inputs": [
      {
        "type": "uint256",
        "name": "punkIndex",
        "indexed": true
      },
      {
        "type": "uint256",
        "name": "value"
      },
      {
        "type": "address",
        "name": "fromAddress",
        "indexed": true
      }
    ]
  },
  {
    "name": "PunkBought",
    "type": "event",
    "inputs": [
      {
        "type": "uint256",
        "name": "punkIndex",
        "indexed": true
      },
      {
        "type": "uint256",
        "name": "value"
      },
      {
        "type": "address",
        "name": "fromAddress",
        "indexed": true
      },
      {
        "type": "address",
        "name": "toAddress",
        "indexed": true
      }
    ]
  },
  {
    "name": "PunkNoLongerForSale",
    "type": "event",
    "inputs": [
      {
        "type": "uint256",
        "name": "punkIndex",
        "indexed": true
      }
    ]
  }
] as const;
