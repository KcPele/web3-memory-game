import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { BigNumber } from "ethers";
import io from "socket.io-client";
import { useAccount } from "wagmi";
import SingleCard from "~~/components/memorygame/SingleCard";
import Message from "~~/components/memorygame/chat/message";
import Player from "~~/components/memorygame/profile/player";
import { useScaffoldContract, useScaffoldContractWrite, useScaffoldEventSubscriber } from "~~/hooks/scaffold-eth";
import { notification } from "~~/utils/scaffold-eth";

/*
[{"src":"/assets/socks/holiday.png","matched":false,"id":1},{"src":"/assets/socks/cold.png","matched":false,"id":2},{"src":"/assets/socks/warm-1.png","matched":false,"id":3},{"src":"/assets/socks/cold-2.png","matched":false,"id":4},{"src":"/assets/socks/warm.png","matched":false,"id":5},{"src":"/assets/socks/white.png","matched":false,"id":6},{"src":"/assets/socks/patterned.png","matched":false,"id":7},{"src":"/assets/socks/black.png","matched":false,"id":8}]
*/
export interface ICard {
  id: BigNumber;
  src: string;
  matched: boolean;
}
export interface IPlayer {
  playerAddress: string;
  score: number;
  state: boolean;
}
let socket: any;

const MemoryGamePlayGround = () => {
  const { address } = useAccount();
  const router = useRouter();
  const cardChoice: ICard = {
    id: BigNumber.from(0),
    src: "",
    matched: false,
  };
  const addressZero = "0x0000000000000000000000000000000000000000";
  const [gameId, setGameId] = useState<BigNumber>(BigNumber.from((router.query.id as string) || "0"));
  const [cards, setCards] = useState<ICard[]>([]); //
  const [gameStarted, setGameStarted] = useState(false); //
  const [turns, setTurns] = useState(0); //
  const [choiceOne, setChoiceOne] = useState<ICard>(cardChoice); //
  const [choiceTwo, setChoiceTwo] = useState<ICard>(cardChoice); //
  const [disabled, setDisabled] = useState(false); //
  const [winner, setWinner] = useState(addressZero); //

  //web3 intergration

  const [playerOne, setPlayerOne] = useState<IPlayer>({
    playerAddress: "",
    score: 0,
    state: false,
  });
  const [playerTwo, setPlayerTwo] = useState<IPlayer>({
    playerAddress: "",
    score: 0,
    state: false,
  });
  useEffect(() => {
    const socketInitializer = async () => {
      // We just call it because we don't need anything else out of it
      await fetch("/api/socket");

      socket = io();
    };
    socketInitializer();
  }, []);

  useEffect(() => {
    setGameId(BigNumber.from((router.query.id as string) || "0"));
  }, [router.query.id]);
  //use webs socke to show that player is playing

  //
  const { writeAsync: makeMove } = useScaffoldContractWrite({
    contractName: "MemoryGame",
    functionName: "makeMove",
    args: [gameId, (choiceOne as ICard).id, (choiceTwo as ICard).id],
    onSuccess: async data => {
      const res = await data.wait();
      console.log(res);
    },

    onBlockConfirmation: txnReceipt => {
      console.log("📦 Transaction blockHash", txnReceipt.blockHash);
      uiCardDisplay();
    },
  });

  //reseting the game
  const { writeAsync: resetGame } = useScaffoldContractWrite({
    contractName: "MemoryGame",
    functionName: "resetGame",
    args: [gameId],
    onSuccess: async data => {
      const res = await data.wait();
      console.log(res);
    },

    onBlockConfirmation: txnReceipt => {
      console.log("📦 Transaction blockHash", txnReceipt.blockHash);
    },
  });

  //player two joing the game
  const { writeAsync: joinGame } = useScaffoldContractWrite({
    contractName: "MemoryGame",
    functionName: "joinGame",
    args: [gameId],
    onSuccess: async data => {
      const res = await data.wait();
      console.log(res);
    },

    onBlockConfirmation: txnReceipt => {
      console.log("📦 Transaction blockHash", txnReceipt.blockHash);
    },
  });

  //shuffle cards

  //handle a choice

  const handleChoice = (card: ICard) => {
    if (gameStarted === false) {
      setChoiceOne(cardChoice);
      setChoiceTwo(cardChoice);
      return;
    } else {
      socket.emit("playerMove", { playerAddress: address, isPlaying: true }, gameId.toString());
      choiceOne.src.length ? setChoiceTwo(card) : setChoiceOne(card);
    }
  };

  //play a turn
  const uiCardDisplay = () => {
    if (choiceOne.src === choiceTwo.src) {
      setCards(prevState => prevState.map(card => (card.src === choiceOne.src ? { ...card, matched: true } : card)));
      restTurn();
    } else {
      setTimeout(restTurn, 1000);
    }
  };
  const playTurn = () => {
    if (choiceOne.src.length && choiceTwo.src.length) {
      console.log("==================making moves ------------------------------");
      setDisabled(true);
      makeMove();
    } else {
      console.log("no moves");
      console.log(disabled);
    }
  };
  //compare two selected cards
  useEffect(() => {
    //prevent player from player if the state is false

    playTurn();
  }, [choiceOne, choiceTwo]);
  //rest choice & increase turn
  const restTurn = () => {
    setChoiceOne(cardChoice);
    setChoiceTwo(cardChoice);
    setTurns(prevState => prevState + 1);
    setDisabled(false);
  };

  //web3 intergration
  const { data: memoryGame } = useScaffoldContract({
    contractName: "MemoryGame",
  });

  const getGameCards = async () => {
    try {
      const gameCards = await memoryGame?.getGameCards(BigNumber.from(router.query.id as string));

      if (gameCards) {
        setCards(gameCards);
        //set players
      }
    } catch (error) {
      console.log(error);
    }
  };
  const getGame = async () => {
    try {
      const gameData = await memoryGame?.gameStore(BigNumber.from(router.query.id as string));
      //fetching and setting game cards
      if (gameData) {
        getGameCards();
        //set players
        setGameStarted(gameData.gameStarted);
        setPlayerOne(gameData.player1);
        setPlayerTwo(gameData.player2);
        restTurn();
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getGame();
    if (socket) {
      socket.emit("joinGameRoom", router.query.id?.toString());
    }
  }, [router.query.id, memoryGame]);

  //players join game
  useEffect(() => {
    //if player two and one is set, then player one has joined redirect others to home page
    if (!playerTwo.playerAddress.length || playerTwo.playerAddress === addressZero) {
      if (playerOne.playerAddress === address) {
        console.log("player one has joined");
      } else {
        console.log("player two has not joined");
        joinGame();
        console.log(playerTwo);
      }
    } else {
      if (!(playerOne.playerAddress === address || !(playerTwo.playerAddress === addressZero))) {
        console.log("filled redirecting....");
      } else {
        console.log("They are the players in the game");
      }
    }
  }, [router.query.id, playerOne, playerTwo, address]);

  //check winner and reset game
  useEffect(() => {
    console.log("checking winner");
    console.log(winner);
    if (winner === addressZero) return;
    if (winner === playerOne.playerAddress || winner === playerTwo.playerAddress) {
      if (winner === address) {
        notification.success("You won the game");
      } else {
        notification.error("You lost the game");
      }
    }
    // if (playerTwo.playerAddress === winner && playerTwo.playerAddress === address) {
    //   console.log("you won the game");
    // } else {
    //   console.log("you lost the game");
    // }
  }, [winner]);

  const checkIfGameIdIsSame = (id: string, callback: () => void) => {
    if (!(id === gameId.toString())) return;
    callback();
  };

  //events emitted in the game
  useScaffoldEventSubscriber({
    contractName: "MemoryGame",
    eventName: "GameJoined",
    listener(...args) {
      checkIfGameIdIsSame(args[1].toString(), () => {
        // console.log("📡 GameJoined event", args);
        getGame();
      });
    },
  });
  useScaffoldEventSubscriber({
    contractName: "MemoryGame",
    eventName: "CardMatched",
    listener(...args) {
      checkIfGameIdIsSame(args[1].toString(), () => {
        // console.log("📡 CardMatched event", args);
        getGame();
      });
    },
  });

  useScaffoldEventSubscriber({
    contractName: "MemoryGame",
    eventName: "CardFlipped",
    listener(...args) {
      checkIfGameIdIsSame(args[1].toString(), () => {
        // console.log("📡 CardFlipped event", args);
        getGame();
      });
    },
  });

  useScaffoldEventSubscriber({
    contractName: "MemoryGame",
    eventName: "GameReset",
    listener(...args) {
      checkIfGameIdIsSame(args[1].toString(), () => {
        // console.log("📡 GameReset event", args);
        getGame();
      });
    },
  });

  useScaffoldEventSubscriber({
    contractName: "MemoryGame",
    eventName: "GameFinished",
    listener(...args) {
      checkIfGameIdIsSame(args[1].toString(), () => {
        setWinner(args[0]);
        getGame();
      });
    },
  });

  return (
    <div className="flex items-center justify-center flex-col mt-8">
      <h1>One Pair</h1>
      {gameStarted ? <p>Game has started</p> : <p>Game has not started waiting for player to join</p>}
      {playerOne.playerAddress === address && (
        <div>
          <button className="btn" onClick={resetGame}>
            New Game
          </button>
        </div>
      )}
      <div className="memory__game-layout max-w-[90%] mt-6">
        <Player playerOne={playerOne} playerTwo={playerTwo} />
        <div className="grid grid-cols-4 gap-4 ">
          {cards.map((card, index) => (
            <SingleCard
              flipped={card === choiceOne || card === choiceTwo || card.matched}
              handleChoice={handleChoice}
              key={index}
              card={card}
              disabled={disabled || playerOne.playerAddress === address ? playerOne.state : playerTwo.state}
            />
          ))}
        </div>
        <Message gameId={gameId.toString()} />
      </div>
      <p>Turns {turns}</p>
    </div>
  );
};

export default MemoryGamePlayGround;
