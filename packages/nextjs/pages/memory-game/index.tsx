import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { BigNumber, ethers } from "ethers";
import { useAccount } from "wagmi";
import { useScaffoldContract, useScaffoldContractWrite, useScaffoldEventSubscriber } from "~~/hooks/scaffold-eth";

const cards = [
  { src: "/assets/socks/holiday.png", matched: false, id: BigNumber.from(1) },
  { src: "/assets/socks/cold.png", matched: false, id: BigNumber.from(2) },
  { src: "/assets/socks/warm-1.png", matched: false, id: BigNumber.from(3) },
  { src: "/assets/socks/cold-2.png", matched: false, id: BigNumber.from(4) },
  { src: "/assets/socks/warm.png", matched: false, id: BigNumber.from(5) },
  { src: "/assets/socks/white.png", matched: false, id: BigNumber.from(6) },
  { src: "/assets/socks/patterned.png", matched: false, id: BigNumber.from(7) },
  { src: "/assets/socks/black.png", matched: false, id: BigNumber.from(8) },
];
const MemoryGame = () => {
  const router = useRouter();
  const { address } = useAccount();
  const level = 0;
  const [price, setPrice] = useState(ethers.utils.parseEther("0.01"));
  const [gameId, setGameId] = useState<number | null>(null);
  const [redirect, setRedirect] = useState(false);
  const { data: memoryGame } = useScaffoldContract({
    contractName: "MemoryGame",
  });
  const config = {
    gasLimit: 1000000,
  };
  const { writeAsync: createGame, isLoading } = useScaffoldContractWrite({
    ...config,
    contractName: "MemoryGame",
    functionName: "createGame",
    args: [level, cards, price],
    value: "0.01",
    onSuccess: async data => {
      const res = await data.wait();
      console.log(res);
      setRedirect(true);
    },

    onBlockConfirmation: txnReceipt => {
      console.log("📦 Transaction blockHash", txnReceipt.blockHash);
    },
  });
  const handleGameCreation = async () => {
    console.log(isLoading);
    setPrice(ethers.utils.parseEther("0.01"));
    const currentGameId = (await memoryGame?.gameCount()) as BigNumber;
    console.log(currentGameId);
    setGameId(currentGameId.toNumber());
    createGame();

    console.log(isLoading);
  };

  useEffect(() => {
    if (gameId) {
      // router.push(`/memory-game/${gameId}`);
    }
  }, [redirect, gameId]);

  //events emitted in the game
  useScaffoldEventSubscriber({
    contractName: "MemoryGame",
    eventName: "GameCreated",
    listener(...args) {
      console.log(args[1].toString());
      if (address == args[0].toString()) {
        router.push(`/memory-game/${args[1].toString()}`);
      }
    },
  });
  return (
    <div className="mt-20 h-full md:grid grid-cols-2 justify-center items-center gap-4">
      <div className=" flex justify-center items-center  w-full">
        <img className="max-w-[50%] rounded-md w-full" src="/assets/socks/patterned.png" alt="socks" />
      </div>
      <div className="mt-8 md-mt-0 text-center max-w-[500px] mx-auto">
        <h1 className="text-4xl">Ultimate flip sock game</h1>
        <div className="">
          <p>Create Your Game</p>
          {/* <div>
            <p>Game Level</p>
            <input
              type="number"
              placeholder="game level 0-2"
              className="border-primary py-2 rounded-full bg-transparent border-2 font-bai-jamjuree w-full px-4    "
              onChange={e => setLevel(Number(e.target.value))}
            />
          </div> */}
          {/* <div>
         price  
          <p>Price</p>
          <IntegerInput value={price} onChange={val => setPrice(val as BigNumber)} />
        </div> */}
          <p>Create a game and share the link to a friend</p>
          <div className="mt-5">
            <button className="border-2 w-full p-2 rounded-full" onClick={handleGameCreation}>
              Create Game
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemoryGame;
