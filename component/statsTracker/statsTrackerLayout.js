import {
  faArrowRotateLeft,
  faFloppyDisk,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import StatsTable from "./statsTable";
import GameForm from "./gameForm";
import LoadingIndicator from "../layout/loadingIndicator";
import useTrackedGame from "@/hooks/useTrackedGame";
import CompleteGame from "./completeGame";

const StatsTrackerLayout = () => {
  const stats = [
    { id: 0, name: "2PM", value: "pm2" },
    { id: 1, name: "2PA", value: "pa2" },
    { id: 2, name: "3PM", value: "pm3" },
    { id: 3, name: "3PA", value: "pa3" },
    { id: 4, name: "FT", value: "ft" },
    { id: 5, name: "FTA", value: "fta" },
    { id: 6, name: "REB", value: "reb" },
    { id: 7, name: "AST", value: "ast" },
    { id: 8, name: "STL", value: "stl" },
    { id: 9, name: "BLK", value: "blk" },
    { id: 10, name: "TO", value: "to" },
    { id: 11, name: "PF", value: "pf" },
    { id: 12, name: "CKD", value: "ckd" },
  ];

  const {
    trackedGame,
    trackedGameLoading,
    postTrackedGame,
    deleteTrackedGame,
  } = useTrackedGame();

  const [game, setGame] = useState(trackedGame);
  const [choosePlayer, setChoosePlayer] = useState(false);
  const [statSelected, setStatSelected] = useState("");
  const [statsRecorded, setStatsRecorded] = useState(trackedGame.statsRecorded);
  const [gameSaved, setGameSaved] = useState(trackedGame.saved);
  const [gameFinished, setGameFinished] = useState(false);
  const [gameOverDisabled, setGameOverDisabled] = useState(
    game.seasonNumber !== ""
  );

  useEffect(() => {
    if (trackedGame) {
      setGame(trackedGame);
      setGameSaved(trackedGame.saved);
      setStatsRecorded(trackedGame.statsRecorded);
    }
  }, [trackedGame]);

  const chooseStat = (stat) => {
    setStatSelected(stat);
    setChoosePlayer(true);
  };

  const addStat = (playerId) => {
    const updatedStats = game.playerStats.map((player) => {
      if (player.id === playerId) {
        if (statSelected === "pm2") {
          player[statSelected] += 1;
          player.pa2 += 1;
          game.teamStats[statSelected] += 1;
          game.teamStats.pa2 += 1;
        } else if (statSelected === "pm3") {
          player[statSelected] += 1;
          player.pa3 += 1;
          game.teamStats[statSelected] += 1;
          game.teamStats.pa3 += 1;
        } else if (statSelected === "ft") {
          player[statSelected] += 1;
          player.fta += 1;
          game.teamStats[statSelected] += 1;
          game.teamStats.fta += 1;
        } else {
          player[statSelected] += 1;
          game.teamStats[statSelected] += 1;
        }
      }

      return player;
    });

    setStatSelected("");
    setChoosePlayer(false);
    setGameSaved(false);
    setGame({
      ...game,
      playerStats: updatedStats,
      statsRecorded: [
        ...game.statsRecorded,
        { playerId: playerId, stat: statSelected },
      ],
    });
  };

  const undoStat = () => {
    const statsRecordedLength = statsRecorded.length;
    if (statsRecordedLength === 0) {
      return;
    }

    const lastStat = statsRecorded[statsRecordedLength - 1];

    const updatedStats = game.playerStats.map((player) => {
      if (player.id === lastStat.playerId) {
        if (lastStat.stat === "pm2") {
          player[lastStat.stat] -= 1;
          player.pa2 -= 1;
          game.teamStats[lastStat.stat] -= 1;
          game.teamStats.pa2 -= 1;
        } else if (lastStat.stat === "pm3") {
          player[lastStat.stat] -= 1;
          player.pa3 -= 1;
          game.teamStats[lastStat.stat] -= 1;
          game.teamStats.pa3 -= 1;
        } else if (lastStat.stat === "ft") {
          player[lastStat.stat] -= 1;
          player.fta -= 1;
          game.teamStats[lastStat.stat] -= 1;
          game.teamStats.fta -= 1;
        } else {
          player[lastStat.stat] -= 1;
          game.teamStats[lastStat.stat] -= 1;
        }
      }

      return player;
    });

    setGame({
      ...game,
      playerStats: updatedStats,
      statsRecorded: statsRecorded.slice(0, -1),
    });
  };

  const saveGame = () => {
    game.saved = true;
    setGameSaved(true);
    postTrackedGame(game);
  };

  const completeGame = () => {
    setGameFinished(true);
  };

  const buttonStyling = `font-bold rounded-lg mx-2 px-2 py-1 ${gameOverDisabled ? "bg-gray-400" : "bg-(--secondary) hover:bg-(--primary) hover:cursor-pointer"}`;

  if (trackedGameLoading) {
    return <LoadingIndicator />;
  } else {
    return (
      <>
        <div className="flex flex-col items-center mt-4">
          <div className="w-11/12 sm:w-4/5">
            <h1 className="text-3xl font-bold text-(--primary) text-center">
              Track Stats
            </h1>

            <GameForm
              game={game}
              setGame={setGame}
              setGameOverDisabled={setGameOverDisabled}
            />

            {!choosePlayer ? (
              <>
                <h2 className="text-center my-2 text-lg">Choose a stat</h2>
                <div className="flex flex-row flex-wrap justify-center">
                  {stats.map((stat) => (
                    <div
                      key={stat.id}
                      className="border-2 border-(--secondary) w-[65px] aspect-square rounded-full flex flex-col items-center justify-center m-2 hover:bg-(--primary) hover:cursor-pointer hover:font-bold"
                      onClick={() => chooseStat(stat.value)}
                    >
                      {stat.name}
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <>
                <h2 className="text-center my-2 text-lg">Choose a player</h2>
                <div className="flex flex-row flex-wrap justify-center">
                  {game.playerStats.map((player) => (
                    <div
                      key={player.id}
                      className="border-2 border-(--secondary) w-[65px] aspect-square rounded-full flex flex-col items-center justify-center m-2 hover:bg-(--primary) hover:cursor-pointer hover:font-bold"
                      onClick={() => addStat(player.id)}
                    >
                      {player.name}
                    </div>
                  ))}
                </div>
              </>
            )}

            <div className="flex flex-col my-4 overflow-x-auto">
              <div className="flex flex-col mb-2">
                <h2 className="text-center text-(--primary) text-2xl font-bold">
                  Game Stats
                </h2>
                <div className="text-(--secondary) flex flex-row justify-between">
                  <FontAwesomeIcon
                    icon={faArrowRotateLeft}
                    className="text-lg hover:text-(--primary) hover:cursor-pointer"
                    onClick={undoStat}
                  />
                  <div className="flex flex-row">
                    {gameSaved && <p className="text-sm mr-4">Saved</p>}
                    <FontAwesomeIcon
                      icon={faFloppyDisk}
                      className="text-lg hover:text-(--primary) hover:cursor-pointer"
                      onClick={saveGame}
                    />
                  </div>
                </div>
              </div>

              <StatsTable
                playerStats={game.playerStats}
                teamStats={game.teamStats}
              />
            </div>

            <div className="flex flex-col items-end">
              <button
                className={buttonStyling}
                disabled={gameOverDisabled}
                onClick={completeGame}
              >
                Game Over
              </button>
            </div>
          </div>
        </div>

        {gameFinished && (
          <CompleteGame
            game={game}
            setGame={setGame}
            setGameFinished={setGameFinished}
            trackedGame={trackedGame}
            deleteTrackedGame={deleteTrackedGame}
          />
        )}
      </>
    );
  }
};

export default StatsTrackerLayout;
