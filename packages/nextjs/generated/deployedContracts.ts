const contracts = {
  31337: [
    {
      chainId: "31337",
      name: "localhost",
      contracts: {
        MemoryGame: {
          address: "0x0DCd1Bf9A1b36cE34237eEaFef220932846BCD82",
          abi: [
            {
              inputs: [],
              name: "MemoryGame__ValueNotEqaultToPrice",
              type: "error",
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: true,
                  internalType: "address",
                  name: "player",
                  type: "address",
                },
                {
                  indexed: false,
                  internalType: "uint256",
                  name: "gameId",
                  type: "uint256",
                },
                {
                  indexed: false,
                  internalType: "bool",
                  name: "player1State",
                  type: "bool",
                },
                {
                  indexed: false,
                  internalType: "bool",
                  name: "player2State",
                  type: "bool",
                },
              ],
              name: "CardFlipped",
              type: "event",
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: true,
                  internalType: "address",
                  name: "player",
                  type: "address",
                },
                {
                  indexed: false,
                  internalType: "uint256",
                  name: "gameId",
                  type: "uint256",
                },
                {
                  indexed: false,
                  internalType: "uint256",
                  name: "cardId",
                  type: "uint256",
                },
              ],
              name: "CardMatched",
              type: "event",
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: true,
                  internalType: "address",
                  name: "player",
                  type: "address",
                },
                {
                  indexed: false,
                  internalType: "uint256",
                  name: "gameId",
                  type: "uint256",
                },
                {
                  indexed: false,
                  internalType: "uint256",
                  name: "cardId",
                  type: "uint256",
                },
              ],
              name: "CardSelected",
              type: "event",
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: true,
                  internalType: "address",
                  name: "player",
                  type: "address",
                },
                {
                  indexed: false,
                  internalType: "uint256",
                  name: "gameId",
                  type: "uint256",
                },
              ],
              name: "GameCancelled",
              type: "event",
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: true,
                  internalType: "address",
                  name: "creator",
                  type: "address",
                },
                {
                  indexed: false,
                  internalType: "uint256",
                  name: "gameId",
                  type: "uint256",
                },
                {
                  indexed: false,
                  internalType: "enum MemoryGame.GameLevel",
                  name: "gameLevel",
                  type: "uint8",
                },
              ],
              name: "GameCreated",
              type: "event",
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: true,
                  internalType: "address",
                  name: "winner",
                  type: "address",
                },
                {
                  indexed: false,
                  internalType: "uint256",
                  name: "gameId",
                  type: "uint256",
                },
              ],
              name: "GameFinished",
              type: "event",
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: true,
                  internalType: "address",
                  name: "player",
                  type: "address",
                },
                {
                  indexed: false,
                  internalType: "uint256",
                  name: "gameId",
                  type: "uint256",
                },
                {
                  indexed: false,
                  internalType: "string",
                  name: "playerName",
                  type: "string",
                },
              ],
              name: "GameJoined",
              type: "event",
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: true,
                  internalType: "address",
                  name: "player",
                  type: "address",
                },
                {
                  indexed: false,
                  internalType: "uint256",
                  name: "gameId",
                  type: "uint256",
                },
              ],
              name: "GameReset",
              type: "event",
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: false,
                  internalType: "uint256",
                  name: "gameId",
                  type: "uint256",
                },
                {
                  indexed: false,
                  internalType: "uint256",
                  name: "playerInGameCount",
                  type: "uint256",
                },
              ],
              name: "GameStarted",
              type: "event",
            },
            {
              inputs: [
                {
                  internalType: "uint256",
                  name: "_gameId",
                  type: "uint256",
                },
              ],
              name: "_checkWinner",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "uint256",
                  name: "_gameId",
                  type: "uint256",
                },
              ],
              name: "cancelGame",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "enum MemoryGame.GameLevel",
                  name: "_gameLevel",
                  type: "uint8",
                },
                {
                  components: [
                    {
                      internalType: "string",
                      name: "src",
                      type: "string",
                    },
                    {
                      internalType: "bool",
                      name: "matched",
                      type: "bool",
                    },
                    {
                      internalType: "uint256",
                      name: "id",
                      type: "uint256",
                    },
                  ],
                  internalType: "struct MemoryGame.Card[]",
                  name: "_gameCards",
                  type: "tuple[]",
                },
                {
                  internalType: "uint256",
                  name: "_price",
                  type: "uint256",
                },
              ],
              name: "createGame",
              outputs: [],
              stateMutability: "payable",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "uint256",
                  name: "_gameId",
                  type: "uint256",
                },
              ],
              name: "endGame",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "uint256",
                  name: "",
                  type: "uint256",
                },
                {
                  internalType: "uint256",
                  name: "",
                  type: "uint256",
                },
              ],
              name: "gameCards",
              outputs: [
                {
                  internalType: "string",
                  name: "src",
                  type: "string",
                },
                {
                  internalType: "bool",
                  name: "matched",
                  type: "bool",
                },
                {
                  internalType: "uint256",
                  name: "id",
                  type: "uint256",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [],
              name: "gameCount",
              outputs: [
                {
                  internalType: "uint256",
                  name: "",
                  type: "uint256",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "uint256",
                  name: "",
                  type: "uint256",
                },
              ],
              name: "gameStore",
              outputs: [
                {
                  internalType: "uint256",
                  name: "id",
                  type: "uint256",
                },
                {
                  internalType: "enum MemoryGame.GameLevel",
                  name: "gameLevel",
                  type: "uint8",
                },
                {
                  components: [
                    {
                      internalType: "uint256",
                      name: "score",
                      type: "uint256",
                    },
                    {
                      internalType: "bool",
                      name: "state",
                      type: "bool",
                    },
                    {
                      internalType: "address",
                      name: "playerAddress",
                      type: "address",
                    },
                  ],
                  internalType: "struct MemoryGame.Player",
                  name: "player1",
                  type: "tuple",
                },
                {
                  components: [
                    {
                      internalType: "uint256",
                      name: "score",
                      type: "uint256",
                    },
                    {
                      internalType: "bool",
                      name: "state",
                      type: "bool",
                    },
                    {
                      internalType: "address",
                      name: "playerAddress",
                      type: "address",
                    },
                  ],
                  internalType: "struct MemoryGame.Player",
                  name: "player2",
                  type: "tuple",
                },
                {
                  internalType: "bool",
                  name: "gameStarted",
                  type: "bool",
                },
                {
                  internalType: "bool",
                  name: "gameFinished",
                  type: "bool",
                },
                {
                  internalType: "uint256",
                  name: "price",
                  type: "uint256",
                },
                {
                  internalType: "address",
                  name: "winner",
                  type: "address",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "uint256",
                  name: "_gameId",
                  type: "uint256",
                },
              ],
              name: "getGameCards",
              outputs: [
                {
                  components: [
                    {
                      internalType: "string",
                      name: "src",
                      type: "string",
                    },
                    {
                      internalType: "bool",
                      name: "matched",
                      type: "bool",
                    },
                    {
                      internalType: "uint256",
                      name: "id",
                      type: "uint256",
                    },
                  ],
                  internalType: "struct MemoryGame.Card[]",
                  name: "",
                  type: "tuple[]",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "uint256",
                  name: "_gameId",
                  type: "uint256",
                },
              ],
              name: "joinGame",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "uint256",
                  name: "_gameId",
                  type: "uint256",
                },
                {
                  internalType: "uint256",
                  name: "_choiceCardIdOne",
                  type: "uint256",
                },
                {
                  internalType: "uint256",
                  name: "_choiceCardIdTwo",
                  type: "uint256",
                },
              ],
              name: "makeMove",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "uint256",
                  name: "_gameId",
                  type: "uint256",
                },
              ],
              name: "resetGame",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
          ],
        },
        YourContract: {
          address: "0xA51c1fc2f0D1a1b8494Ed1FE312d7C3a78Ed91C0",
          abi: [
            {
              inputs: [
                {
                  internalType: "address",
                  name: "_owner",
                  type: "address",
                },
              ],
              stateMutability: "nonpayable",
              type: "constructor",
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: true,
                  internalType: "address",
                  name: "greetingSetter",
                  type: "address",
                },
                {
                  indexed: false,
                  internalType: "string",
                  name: "newGreeting",
                  type: "string",
                },
                {
                  indexed: false,
                  internalType: "bool",
                  name: "premium",
                  type: "bool",
                },
                {
                  indexed: false,
                  internalType: "uint256",
                  name: "value",
                  type: "uint256",
                },
              ],
              name: "GreetingChange",
              type: "event",
            },
            {
              inputs: [],
              name: "greeting",
              outputs: [
                {
                  internalType: "string",
                  name: "",
                  type: "string",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [],
              name: "owner",
              outputs: [
                {
                  internalType: "address",
                  name: "",
                  type: "address",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [],
              name: "premium",
              outputs: [
                {
                  internalType: "bool",
                  name: "",
                  type: "bool",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "string",
                  name: "_newGreeting",
                  type: "string",
                },
              ],
              name: "setGreeting",
              outputs: [
                {
                  internalType: "string",
                  name: "",
                  type: "string",
                },
              ],
              stateMutability: "payable",
              type: "function",
            },
            {
              inputs: [],
              name: "totalCounter",
              outputs: [
                {
                  internalType: "uint256",
                  name: "",
                  type: "uint256",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "",
                  type: "address",
                },
              ],
              name: "userGreetingCounter",
              outputs: [
                {
                  internalType: "uint256",
                  name: "",
                  type: "uint256",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [],
              name: "withdraw",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              stateMutability: "payable",
              type: "receive",
            },
          ],
        },
      },
    },
  ],
} as const;

export default contracts;
