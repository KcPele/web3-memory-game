import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAccount } from "wagmi";
import { ICard } from "~~/pages/memory-game/[id]";

const Player = ({ cards }: { cards: ICard[] }) => {
  const router = useRouter();
  const [gameData, setGameData] = useState<{
    game_id: string;
    cards: [];
    players: { player_one: string; player_two: string };
  } | null>(null);
  const { address } = useAccount();
  useEffect(() => {
    if (router.query.id) {
      const game = localStorage.getItem("gameData");
      if (game) {
        setGameData(JSON.parse(game));
        console.log(JSON.parse(game));
      }
    }
  }, [router.query.id, cards]);

  //add player two to the game object
  useEffect(() => {
    if (gameData && gameData.players && address && gameData.players.player_one !== address) {
      setGameData({ ...gameData, players: { ...gameData.players, player_two: address } });
      // localStorage.setItem(
      //   "gameData",
      //   JSON.stringify({ ...gameData, players: { ...gameData.players, player_two: address } }),
      // );
    }
  }, [router.query.id, address]);

  return <div>Player</div>;
};

export default Player;
