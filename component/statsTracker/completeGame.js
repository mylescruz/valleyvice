import useRoster from "@/hooks/useRoster";
import useSeason from "@/hooks/useSeason";
import { useState } from "react";

const CompleteGame = ({
  game,
  setGame,
  setGameFinished,
  trackedGame,
  deleteTrackedGame,
  setEnterGameInfo,
}) => {
  const { season, putSeason } = useSeason(game.seasonNumber);
  const { roster, putRoster } = useRoster();
  const [gameScores, setGameScores] = useState({
    opponentScore: 0,
    totalScore: 0,
  });

  const handleInput = (e) => {
    const input = e.target.value;

    if (input === "") {
      setGameScores({ ...gameScores, [e.target.id]: input });
    } else {
      setGameScores({ ...gameScores, [e.target.id]: parseInt(input) });
    }
  };

  const closeComplete = () => {
    setGameFinished(false);
  };

  const submitGame = () => {
    try {
      const finalGame = {
        ...game,
        opponentScore: gameScores.opponentScore,
        totalScore: gameScores.totalScore,
        result: gameScores.totalScore > gameScores.opponentScore ? "W" : "L",
      };

      const updatedPlayerStats = season.playerTotalStats.map((player) => {
        game.playerStats.forEach((pyr) => {
          if (player.id === pyr.id) {
            player.gp += 1;
            player.pm2 += pyr.pm2;
            player.pa2 += pyr.pa2;
            player.pm3 += pyr.pm3;
            player.pa3 += pyr.pa3;
            player.ft += pyr.ft;
            player.fta += pyr.fta;
            player.reb += pyr.reb;
            player.ast += pyr.ast;
            player.stl += pyr.stl;
            player.blk += pyr.blk;
            player.to += pyr.to;
            player.pf += pyr.pf;
            player.ckd += pyr.ckd;
          }
        });

        return player;
      });

      const updatedSeason = {
        ...season,
        playerTotalStats: updatedPlayerStats,
        games: [...season.games, finalGame],
        wins: finalGame.result === "W" ? season.wins + 1 : season.wins,
        losses: finalGame.result === "L" ? season.losses + 1 : season.losses,
      };

      const updatedRoster = roster.map((player) => {
        updatedPlayerStats.forEach((playerStats) => {
          if (player.id === playerStats.id) {
            player.gp += playerStats.gp;
            player.pm2 += playerStats.pm2;
            player.pa2 += playerStats.pa2;
            player.pm3 += playerStats.pm3;
            player.pa3 += playerStats.pa3;
            player.ft += playerStats.ft;
            player.fta += playerStats.fta;
            player.reb += playerStats.reb;
            player.ast += playerStats.ast;
            player.stl += playerStats.stl;
            player.blk += playerStats.blk;
            player.to += playerStats.to;
            player.pf += playerStats.pf;
            player.ckd += playerStats.ckd;
          }
        });

        return player;
      });

      putSeason(updatedSeason);
      putRoster(updatedRoster);
      deleteTrackedGame();
      setGame(trackedGame);

      closeComplete();
      setEnterGameInfo(true);
    } catch (error) {
      console.error(error);
      closeComplete();
      return;
    }
  };

  const gameDetailsInputGroup = "flex flex-col my-1.5";
  const gameDetailsInput =
    "border-2 border-(--secondary) rounded-lg py-1 px-2 lg:mr-4";
  const buttonStyling =
    "font-bold rounded-lg mx-2 px-2 py-1 hover:bg-(--primary) hover:cursor-pointer";

  return (
    <div className="fixed top-0 left-0 w-[100%] h-[100%] bg-[rgba(255,255,255,0.2)] z-50 flex flex-col justify-center items-center">
      <div className="w-11/12 sm:w-2/3 md:w-3/5 lg:w-2/5 xl:w-2/7 bg-(--background) p-4 rounded-lg flex flex-col">
        <h1 className="text-(--primary) text-xl mb-2">Finish Game</h1>
        <p>Enter final scores of the game</p>
        <form className="w-full flex flex-col sm:flex-row sm:justify-between">
          <div className={gameDetailsInputGroup}>
            <label htmlFor="totalScore">Valley Vice</label>
            <input
              id="totalScore"
              type="number"
              onChange={handleInput}
              className={gameDetailsInput}
              value={gameScores.totalScore}
            />
          </div>
          <div className={gameDetailsInputGroup}>
            <label htmlFor="opponentScore">{game.opponent}</label>
            <input
              id="opponentScore"
              type="number"
              onChange={handleInput}
              className={gameDetailsInput}
              value={gameScores.opponentScore}
            />
          </div>
        </form>
        <div className="flex flex-row justify-end mt-4">
          <button
            className={`${buttonStyling} bg-gray-500`}
            onClick={closeComplete}
          >
            Cancel
          </button>
          <button
            className={`${buttonStyling} bg-(--secondary)`}
            onClick={submitGame}
          >
            Complete
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompleteGame;
