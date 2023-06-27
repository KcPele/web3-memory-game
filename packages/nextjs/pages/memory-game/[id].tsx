import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAccount } from "wagmi";
import SingleCard from "~~/components/memorygame/SingleCard";
import Message from "~~/components/memorygame/chat/message";
import Player from "~~/components/memorygame/profile/player";

const cardImages = [
  { src: "/assets/socks/holiday.png", matched: false },
  { src: "/assets/socks/cold.png", matched: false },
  { src: "/assets/socks/warm-1.png", matched: false },

  { src: "/assets/socks/cold-2.png", matched: false },
  { src: "/assets/socks/warm.png", matched: false },
  { src: "/assets/socks/white.png", matched: false },
  { src: "/assets/socks/patterned.png", matched: false },
  { src: "/assets/socks/black.png", matched: false },
];

// const cardImages = [
//   { src: "/assets/socks/holiday.png", matched: false, id: 1 },
//   { src: "/assets/socks/cold.png", matched: false, id: 2 },
//   { src: "/assets/socks/warm-1.png", matched: false, id: 3 },

//   { src: "/assets/socks/cold-2.png", matched: false, id: 4 },
//   { src: "/assets/socks/warm.png", matched: false, id: 5 },
//   { src: "/assets/socks/white.png", matched: false, id: 6 },
//   { src: "/assets/socks/patterned.png", matched: false, id: 7 },
//   { src: "/assets/socks/black.png", matched: false, id: 8 },
// ];
/*
[{"src":"/assets/socks/holiday.png","matched":false,"id":1},{"src":"/assets/socks/cold.png","matched":false,"id":2},{"src":"/assets/socks/warm-1.png","matched":false,"id":3},{"src":"/assets/socks/cold-2.png","matched":false,"id":4},{"src":"/assets/socks/warm.png","matched":false,"id":5},{"src":"/assets/socks/white.png","matched":false,"id":6},{"src":"/assets/socks/patterned.png","matched":false,"id":7},{"src":"/assets/socks/black.png","matched":false,"id":8}]
*/
export interface ICard {
  id: number;
  src: string;
  matched: boolean;
}

const MemoryGame = () => {
  const [cards, setCards] = useState<ICard[]>([]); //
  const [turns, setTurns] = useState(0); //
  const [choiceOne, setChoiceOne] = useState<ICard | null>(null); //
  const [choiceTwo, setChoiceTwo] = useState<ICard | null>(null); //
  const [disabled, setDisabled] = useState(false); //
  //shuffle cards
  const shuffleCards = () => {
    const shuffledCards = [...cardImages, ...cardImages]
      .sort(() => Math.random() - 0.5)
      .map(card => ({ ...card, id: Math.random() }));

    setChoiceOne(null);
    setChoiceTwo(null);
    setCards(shuffledCards);
    setTurns(0);
  };

  //handle a choice

  const handleChoice = (card: ICard) => {
    choiceOne ? setChoiceTwo(card) : setChoiceOne(card);
  };

  //compare two selected cards
  useEffect(() => {
    if (choiceOne && choiceTwo) {
      setDisabled(true);
      if (choiceOne.src === choiceTwo.src) {
        setCards(prevState => prevState.map(card => (card.src === choiceOne.src ? { ...card, matched: true } : card)));

        restTurn();
      } else {
        setTimeout(restTurn, 1000);
      }
    }
  }, [choiceOne, choiceTwo]);
  //rest choice & increase turn
  const restTurn = () => {
    setChoiceOne(null);
    setChoiceTwo(null);
    setTurns(prevState => prevState + 1);
    setDisabled(false);
  };

  useEffect(() => {
    const game = localStorage.getItem("gameData");
    if (game) {
      setCards(JSON.parse(game).cards);
    } else {
      shuffleCards();
    }
  }, []);
  const { address } = useAccount();
  const router = useRouter();
  console.log(router.query.id);

  //create game object with the player address and the game state and id
  useEffect(() => {
    console.log(address);
    if (router.query.id) {
      const game = localStorage.getItem("gameData");
      if (game) {
        localStorage.setItem("gameData", JSON.stringify({ ...JSON.parse(game), cards }));
      } else {
        localStorage.setItem(
          "gameData",
          JSON.stringify({ game_id: router.query.id, cards, players: { player_one: address, player_two: "" } }),
        );
      }
    }
  }, [cards]);

  return (
    <div className="flex items-center justify-center flex-col mt-8">
      <h1>One Pair</h1>
      <button onClick={shuffleCards}>New Game</button>
      <div className="memory__game-layout max-w-[90%] mt-6">
        <Player cards={cards} />
        <div className="grid grid-cols-4 gap-4 ">
          {cards.map(card => (
            <SingleCard
              flipped={card === choiceOne || card === choiceTwo || card.matched}
              handleChoice={handleChoice}
              key={card.id}
              card={card}
              disabled={disabled}
            />
          ))}
        </div>
        <Message />
      </div>
      <p>Turns {turns}</p>
    </div>
  );
};

export default MemoryGame;
