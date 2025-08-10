import {
  faArrowRotateLeft,
  faFloppyDisk,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useEffect, useState } from "react";
import StatsTable from "./statsTable";
import LoadingIndicator from "../layout/loadingIndicator";
import useTrackedGame from "@/hooks/useTrackedGame";
import CompleteGame from "./completeGame";
import GameInfoForm from "./gameInfoForm";
import { InfoContext } from "@/contexts/InfoContext";
import useRoster from "@/hooks/useRoster";
import dateFormatter from "@/helpers/dateFormatter";

const emptyGame = {
  id: "",
  seasonNumber: "",
  gameNumber: "",
  date: "",
  location: "",
  opponent: "",
  totalScore: "",
  opponentScore: "",
  result: "",
  teamStats: {
    pm2: 0,
    pa2: 0,
    pm3: 0,
    pa3: 0,
    ft: 0,
    fta: 0,
    reb: 0,
    ast: 0,
    stl: 0,
    blk: 0,
    to: 0,
    pf: 0,
    ckd: 0,
  },
  playerStats: [],
  statsRecorded: [],
  saved: false,
};

const stats = [
  { name: "2PM", value: "pm2" },
  { name: "2PA", value: "pa2" },
  { name: "3PM", value: "pm3" },
  { name: "3PA", value: "pa3" },
  { name: "FT", value: "ft" },
  { name: "FTA", value: "fta" },
  { name: "REB", value: "reb" },
  { name: "AST", value: "ast" },
  { name: "STL", value: "stl" },
  { name: "BLK", value: "blk" },
  { name: "TO", value: "to" },
  { name: "PF", value: "pf" },
  { name: "CKD", value: "ckd" },
];

const StatsTrackerLayout = () => {
  const { info, infoLoading } = useContext(InfoContext);
  const { roster, rosterLoading } = useRoster(info.currentSeason);

  const {
    trackedGame,
    trackedGameLoading,
    postTrackedGame,
    deleteTrackedGame,
  } = useTrackedGame();

  const [game, setGame] = useState(emptyGame);
  const [enterGameInfo, setEnterGameInfo] = useState(false);
  const [chooseStat, setChooseStat] = useState(true);
  const [choosePlayer, setChoosePlayer] = useState(false);
  const [chooseAssist, setChooseAssist] = useState(false);
  const [shotMaker, setShotMaker] = useState("");
  const [statSelected, setStatSelected] = useState("");
  const [gameFinished, setGameFinished] = useState(false);

  // Set the current roster to determine who is playing
  useEffect(() => {
    if (roster && !trackedGame) {
      const currentRoster = roster
        .filter((player) => player.id !== "vvSubs")
        .map((player) => {
          return {
            id: player.id,
            name: player.name,
            number: player.number,
            pm2: 0,
            pa2: 0,
            pm3: 0,
            pa3: 0,
            ft: 0,
            fta: 0,
            reb: 0,
            ast: 0,
            stl: 0,
            blk: 0,
            to: 0,
            pf: 0,
            ckd: 0,
          };
        });

      setGame({ ...emptyGame, playerStats: currentRoster });
    }
  }, [roster, trackedGame]);

  // If there is already a saved game, set the game to the tracked game
  useEffect(() => {
    if (trackedGame) {
      setGame(trackedGame);
      setEnterGameInfo(!trackedGame.saved);
    }
  }, [trackedGame]);

  const selectStat = (stat) => {
    setChooseStat(false);
    setStatSelected(stat);
    setChoosePlayer(true);
  };

  const selectAssister = (playerId) => {
    if (statSelected === "pm2" || statSelected === "pm3") {
      setChoosePlayer(false);
      setChooseAssist(true);
    } else {
      setChoosePlayer(false);
      addStat(playerId);
    }
  };

  const addAssist = (playerId) => {
    addStat(shotMaker);

    if (playerId !== "") {
      const updatedStats = game.playerStats.map((player) => {
        if (player.id === playerId) {
          player.ast += 1;
          game.teamStats.ast += 1;
        }

        return player;
      });

      setGame({
        ...game,
        playerStats: updatedStats,
        statsRecorded: [
          ...game.statsRecorded,
          { playerId: shotMaker, stat: statSelected },
          { playerId: playerId, stat: "ast" },
        ],
      });
    }

    setShotMaker("");
    setChooseAssist(false);
    setChooseStat(true);
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
    setGame({
      ...game,
      playerStats: updatedStats,
      statsRecorded: [
        ...game.statsRecorded,
        { playerId: playerId, stat: statSelected },
      ],
      saved: false,
    });
    setChooseStat(true);
  };

  const undoStat = () => {
    const statsRecordedLength = game.statsRecorded.length;
    if (statsRecordedLength === 0) {
      return;
    }

    const lastStat = game.statsRecorded[statsRecordedLength - 1];

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
      statsRecorded: game.statsRecorded.slice(0, -1),
    });
  };

  const saveGame = async () => {
    game.saved = true;
    setGame({
      ...game,
      saved: true,
    });
    await postTrackedGame(game);
  };

  const completeGame = () => {
    setGameFinished(true);
  };

  const buttonStyling =
    "font-bold rounded-lg mx-2 px-2 py-1 bg-(--secondary) hover:bg-(--primary) hover:cursor-pointer";
  const bubbleStyling =
    "border-2 border-(--secondary) w-[70px] aspect-square rounded-full flex flex-col items-center justify-center m-2 font-bold hover:bg-(--primary) hover:cursor-pointer";

  if (infoLoading || rosterLoading || trackedGameLoading) {
    return <LoadingIndicator />;
  } else {
    return (
      <>
        <div className="flex flex-col items-center mt-4">
          <div className="w-11/12 sm:w-4/5">
            {enterGameInfo ? (
              <>
                <h1 className="text-3xl font-bold text-(--primary) text-center">
                  Enter Game Info
                </h1>
                <GameInfoForm
                  game={game}
                  setGame={setGame}
                  setEnterGameInfo={setEnterGameInfo}
                />
              </>
            ) : (
              <>
                <div className="text-center">
                  <h1 className="text-3xl font-bold text-(--primary)">
                    Track Game Stats
                  </h1>
                  <p className="text-(--secondary)">
                    Valley Vice vs. {game.opponent}
                  </p>
                  <p className="text-(--secondary)">
                    {dateFormatter(game.date)} at {game.location}
                  </p>
                </div>
                {chooseStat && (
                  <>
                    <h2 className="text-center my-2 text-lg">Choose a stat</h2>
                    <div className="flex flex-row flex-wrap justify-center">
                      {stats.map((stat, index) => (
                        <div
                          key={index}
                          className={bubbleStyling}
                          onClick={() => selectStat(stat.value)}
                        >
                          {stat.name}
                        </div>
                      ))}
                    </div>
                  </>
                )}
                {choosePlayer && (
                  <>
                    <h2 className="text-center my-2 text-lg">
                      Choose a player
                    </h2>
                    <div className="flex flex-row flex-wrap justify-center">
                      {game.playerStats.map((player) => (
                        <div
                          key={player.id}
                          className={bubbleStyling}
                          onClick={() => {
                            setShotMaker(player.id);
                            selectAssister(player.id);
                          }}
                        >
                          {player.name}
                        </div>
                      ))}
                    </div>
                  </>
                )}
                {chooseAssist && (
                  <>
                    <h2 className="text-center my-2 text-lg">Who assisted?</h2>
                    <div className="flex flex-row flex-wrap justify-center">
                      <div
                        className={bubbleStyling}
                        onClick={() => addAssist("")}
                      >
                        None
                      </div>
                      {game.playerStats
                        .filter((player) => player.id !== shotMaker)
                        .map((player) => (
                          <div
                            key={player.id}
                            className={bubbleStyling}
                            onClick={() => addAssist(player.id)}
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
                        className={`${
                          game.statsRecorded?.length === 0
                            ? "text-gray-500"
                            : "text-lg hover:text-(--primary) hover:cursor-pointer"
                        }`}
                        onClick={undoStat}
                      />
                      <div className="flex flex-row">
                        {game.saved && <p className="text-sm mr-4">Saved</p>}
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
                  <button className={buttonStyling} onClick={completeGame}>
                    Game Over
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {gameFinished && (
          <CompleteGame
            game={game}
            setGame={setGame}
            setGameFinished={setGameFinished}
            trackedGame={trackedGame}
            deleteTrackedGame={deleteTrackedGame}
            setEnterGameInfo={setEnterGameInfo}
          />
        )}
      </>
    );
  }
};

export default StatsTrackerLayout;
