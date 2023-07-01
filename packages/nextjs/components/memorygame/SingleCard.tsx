import React from "react";
import { ICard } from "~~/pages/memory-game/[id]";

const SingleCard = ({
  card,
  handleChoice,
  flipped,
  disabled,
}: {
  card: ICard;
  handleChoice: (card: ICard) => void;
  flipped: boolean;
  disabled: boolean;
}) => {
  const handleClick = () => {
    console.log("disabled", disabled);
    if (disabled) return;
    handleChoice(card);
  };
  return (
    <div className="relative max-w-[100%] card">
      <div className={flipped ? "flipped" : ""}>
        <img className="front w-full block border-2 border-white rounded " src={card.src} alt="card front" />
        <img
          className="back w-full block border-2 border-white rounded"
          src="/assets/socks/cover.png"
          onClick={handleClick}
          alt="card back"
        />
      </div>
    </div>
  );
};

export default SingleCard;
