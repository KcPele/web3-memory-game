import { useAccount } from "wagmi";
import { Address } from "~~/components/scaffold-eth";
import { IPlayer } from "~~/pages/memory-game/[id]";

const Player = ({ playerOne, playerTwo }: { playerOne: IPlayer; playerTwo: IPlayer }) => {
  const { address } = useAccount();

  return (
    <div>
      <h2>Players</h2>
      <div>
        <div className=" flex gap-4">
          {playerOne?.playerAddress === address ? <p>You</p> : <Address address={playerOne?.playerAddress} />}
          <p>Score {playerOne.score.toString()}</p>
          {playerOne.playerAddress === address && !playerOne.state && <p>Your Turn</p>}
        </div>
        <div className="flex gap-4">
          {playerTwo?.playerAddress === address ? <p>You</p> : <Address address={playerTwo?.playerAddress} />}
          <p>Score {playerTwo.score.toString()}</p>
          {playerTwo.playerAddress === address && !playerTwo.state && <p>Your Turn</p>}
        </div>
      </div>
    </div>
  );
};

export default Player;
