import {
  faArrowRotateLeft,
  faFloppyDisk,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import StatsTrackerTable from "./statsTrackerTable";
import dateFormatter from "@/helpers/dateFormatter";
import { useEffect, useRef, useState } from "react";
import ConfirmRestartModal from "./confirmRestartModal";

const statsLegend = [
  { name: "2PM", value: "twoPointsMade" },
  { name: "2PA", value: "twoPointsAttempted" },
  { name: "3PM", value: "threePointsMade" },
  { name: "3PA", value: "threePointsAttempted" },
  { name: "FTM", value: "freeThrowsMade" },
  { name: "FTA", value: "freeThrowsAttempted" },
  { name: "REB", value: "rebounds" },
  { name: "AST", value: "assists" },
  { name: "STL", value: "steals" },
  { name: "BLK", value: "blocks" },
  { name: "TO", value: "turnovers" },
  { name: "PF", value: "personalFouls" },
  { name: "CKD", value: "cooked" },
];

const statsMap = {
  twoPointsMade: "made a two point shot",
  twoPointsAttempted: "attempted a two point shot",
  threePointsMade: "made a three pointer",
  threePointsAttempted: "attempted a three pointer",
  freeThrowsMade: "made a free throw",
  freeThrowsAttempted: "attempted a free throw",
  rebounds: "grabbed a rebound",
  assists: "assisted the shot",
  steals: "stole the ball",
  blocks: "blocked a shot",
  turnovers: "turned the ball over",
  personalFouls: "committed a foul",
  cooked: "got cooked!",
};

const screenOptions = {
  stats: "stats",
  players: "players",
  assists: "assists",
};

const quarterStyling =
  "font-bold rounded-lg mx-2 px-2 py-1 bg-(--secondary) hover:bg-(--primary) hover:cursor-pointer";
const selectedQuarterStyling =
  "font-bold rounded-lg mx-2 px-2 py-1 bg-(--primary) hover:bg-(--secondary) hover:cursor-pointer";
const restartButtonStyling =
  "font-bold rounded-lg mx-2 px-2 py-1 bg-gray-500 hover:bg-(--primary) hover:cursor-pointer";
const endButtonStyling =
  "font-bold rounded-lg mx-2 px-2 py-1 bg-(--secondary) hover:bg-(--primary) hover:cursor-pointer";
const bubbleStyling =
  "border-2 border-(--secondary) w-[70px] aspect-square rounded-full flex flex-col items-center justify-center m-2 font-bold hover:bg-(--primary) hover:cursor-pointer";

const StatsTracker = ({
  game,
  setGame,
  postTrackedGame,
  setCompleteModal,
  deleteTrackedGame,
}) => {
  const [quarter, setQuarter] = useState("quarter1");
  const [screen, setScreen] = useState(screenOptions.stats);
  const [shotMaker, setShotMaker] = useState("");
  const [statSelected, setStatSelected] = useState("");
  const [restartModal, setRestartModal] = useState(false);
  const [gameSaved, setGameSaved] = useState(false);
  const savingGameRef = useRef(false);

  useEffect(() => {
    if (!game || savingGameRef.current) {
      return;
    }

    const timeout = setTimeout(async () => {
      savingGameRef.current = true;
      try {
        await postTrackedGame(game);
      } finally {
        savingGameRef.current = false;
        setGameSaved(true);
      }
    }, 5000);

    return () => clearTimeout(timeout);
  }, [game, postTrackedGame]);

  const selectQuarter = (quarterIndex) => {
    if (quarterIndex === 0) {
      setQuarter("quarter1");
    } else if (quarterIndex === 1) {
      setQuarter("quarter2");
    } else if (quarterIndex === 2) {
      setQuarter("quarter3");
    } else {
      setQuarter("quarter4");
    }
  };

  const selectStat = (stat) => {
    setStatSelected(stat);
    setScreen(screenOptions.players);
  };

  const selectAssister = (player) => {
    if (
      statSelected === "twoPointsMade" ||
      statSelected === "threePointsMade"
    ) {
      setScreen(screenOptions.assists);
    } else {
      addStat(player);
      setScreen(screenOptions.stats);
    }
  };

  // If someone assisted the made shot, include their stat
  const addAssist = (assister) => {
    addStat(shotMaker, assister);

    setShotMaker("");
  };

  // Add the stat recorded
  const addStat = (selectedPlayer, assister = null) => {
    // Update the player's individual stats
    const updatedPlayerStats = game.players.map((player) => {
      if (assister && assister.playerId === player.playerId) {
        return {
          ...player,
          assists: player.assists + 1,
        };
      } else if (player.playerId !== selectedPlayer.playerId) {
        return player;
      }

      switch (statSelected) {
        case "twoPointsMade":
          return {
            ...player,
            twoPointsMade: player.twoPointsMade + 1,
            twoPointsAttempted: player.twoPointsAttempted + 1,
            points: player.points + 2,
          };
        case "threePointsMade":
          return {
            ...player,
            threePointsMade: player.threePointsMade + 1,
            threePointsAttempted: player.threePointsAttempted + 1,
            points: player.points + 3,
          };
        case "freeThrowsMade":
          return {
            ...player,
            freeThrowsMade: player.freeThrowsMade + 1,
            freeThrowsAttempted: player.freeThrowsAttempted + 1,
            points: player.points + 1,
          };
        default:
          return {
            ...player,
            [statSelected]: player[statSelected] + 1,
          };
      }
    });

    // Update the team's total stats
    const updatedTeamStats = { ...game.teamStats };

    switch (statSelected) {
      case "twoPointsMade":
        updatedTeamStats.twoPointsMade += 1;
        updatedTeamStats.twoPointsAttempted += 1;
        updatedTeamStats.points += 2;
        break;
      case "threePointsMade":
        updatedTeamStats.threePointsMade += 1;
        updatedTeamStats.threePointsAttempted += 1;
        updatedTeamStats.points += 3;
        break;
      case "freeThrowsMade":
        updatedTeamStats.freeThrowsMade += 1;
        updatedTeamStats.freeThrowsAttempted += 1;
        updatedTeamStats.points += 1;
        break;
      default:
        updatedTeamStats[statSelected] += 1;
    }

    const updatedPlayByPlay = {
      ...game.playByPlay,
      [quarter]: [
        ...game.playByPlay[quarter],
        {
          playerId: selectedPlayer.playerId,
          playerName: selectedPlayer.name,
          stat: statSelected,
        },
      ],
    };

    if (assister) {
      updatedTeamStats.assists += 1;
      updatedPlayByPlay[quarter] = [
        ...updatedPlayByPlay[quarter],
        {
          playerId: assister.playerId,
          playerName: assister.name,
          stat: "assists",
        },
      ];
    }

    setStatSelected("");
    setGame({
      ...game,
      players: updatedPlayerStats,
      teamStats: updatedTeamStats,
      playByPlay: updatedPlayByPlay,
      currentlyTracking: false,
    });
    setGameSaved(false);
    setScreen(screenOptions.stats);
  };

  // Remove the last stat recorded
  const undoStat = () => {
    const playByPlayLength = game.playByPlay[quarter].length;

    if (playByPlayLength === 0) {
      return;
    }

    const lastStat = game.playByPlay[quarter][playByPlayLength - 1];

    // Update the player's individual stats
    const updatedPlayerStats = game.players.map((player) => {
      if (player.playerId !== lastStat.playerId) {
        return player;
      }

      switch (lastStat.stat) {
        case "twoPointsMade":
          return {
            ...player,
            twoPointsMade: player.twoPointsMade - 1,
            twoPointsAttempted: player.twoPointsAttempted - 1,
            points: player.points - 2,
          };
        case "threePointsMade":
          return {
            ...player,
            threePointsMade: player.threePointsMade - 1,
            threePointsAttempted: player.threePointsAttempted - 1,
            points: player.points - 3,
          };
        case "freeThrowsMade":
          return {
            ...player,
            freeThrowsMade: player.freeThrowsMade - 1,
            freeThrowsAttempted: player.freeThrowsAttempted - 1,
            points: player.points - 1,
          };
        default:
          return {
            ...player,
            [lastStat.stat]: player[lastStat.stat] - 1,
          };
      }
    });

    // Update the team's total stats
    const updatedTeamStats = { ...game.teamStats };

    switch (lastStat.stat) {
      case "twoPointsMade":
        updatedTeamStats.twoPointsMade -= 1;
        updatedTeamStats.twoPointsAttempted -= 1;
        updatedTeamStats.points -= 2;
        break;
      case "threePointsMade":
        updatedTeamStats.threePointsMade -= 1;
        updatedTeamStats.threePointsAttempted -= 1;
        updatedTeamStats.points -= 3;
        break;
      case "freeThrowsMade":
        updatedTeamStats.freeThrowsMade -= 1;
        updatedTeamStats.freeThrowsAttempted -= 1;
        updatedTeamStats.points -= 1;
        break;
      default:
        updatedTeamStats[lastStat.stat] -= 1;
    }

    setStatSelected("");
    setGame({
      ...game,
      players: updatedPlayerStats,
      teamStats: updatedTeamStats,
      playByPlay: {
        ...game.playByPlay,
        [quarter]: game.playByPlay[quarter].slice(0, -1),
      },
      currentlyTracking: false,
    });
    setGameSaved(false);
  };

  const saveGame = async () => {
    setGame({ ...game, currentlyTracking: true });
    await postTrackedGame({ ...game, currentlyTracking: true });
    setGameSaved(true);
  };

  const confirmRestart = () => {
    setRestartModal(true);
  };

  const completeGame = () => {
    setGame({ ...game, valleyViceScore: game.teamStats.points });
    setCompleteModal(true);
  };

  return (
    <>
      <div className="text-center">
        <h1 className="text-3xl font-bold text-(--primary)">
          Track Game Stats
        </h1>
        <p className="text-(--secondary)">Valley Vice vs. {game.opponent}</p>
        <p className="text-(--secondary)">
          {dateFormatter(game.date)} at {game.location}
        </p>
      </div>
      <div className="flex flex-row justify-center my-4">
        {Array.from({ length: 4 }, (_, index) => (
          <div
            key={index}
            className={
              quarter === `quarter${index + 1}`
                ? selectedQuarterStyling
                : quarterStyling
            }
            onClick={() => selectQuarter(index)}
          >
            Q{index + 1}
          </div>
        ))}
      </div>
      {screen === screenOptions.stats && (
        <>
          <h2 className="text-center my-2 text-lg font-bold">Choose a stat</h2>
          <div className="flex flex-row flex-wrap justify-center">
            {statsLegend.map((stat, index) => (
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
      {screen === screenOptions.players && (
        <>
          <h2 className="text-center my-2 text-lg font-bold">
            Which player {statsMap[statSelected]}?
          </h2>
          <div className="flex flex-row flex-wrap justify-center">
            {game.players.map((player) => (
              <div
                key={player.playerId}
                className={bubbleStyling}
                onClick={() => {
                  setShotMaker(player);
                  selectAssister(player);
                }}
              >
                {player.name}
              </div>
            ))}
          </div>
        </>
      )}
      {screen === screenOptions.assists && (
        <>
          <h2 className="text-center my-2 text-lg font-bold">
            Who assisted {shotMaker.name}?
          </h2>
          <div className="flex flex-row flex-wrap justify-center">
            <div
              className={bubbleStyling}
              onClick={() => {
                addAssist(null);
              }}
            >
              None
            </div>
            {game.players
              .filter((player) => player.playerId !== shotMaker.playerId)
              .map((player) => (
                <div
                  key={player.playerId}
                  className={bubbleStyling}
                  onClick={() => {
                    addAssist(player);
                  }}
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
                game.playByPlay[quarter].length === 0
                  ? "text-gray-500"
                  : "text-lg hover:text-(--primary) hover:cursor-pointer"
              }`}
              onClick={undoStat}
            />
            <div className="flex flex-row">
              {gameSaved && <p className="text-sm mr-4">Saved</p>}
              <FontAwesomeIcon
                icon={faFloppyDisk}
                className={`${
                  gameSaved
                    ? "text-gray-500"
                    : "text-lg hover:text-(--primary) hover:cursor-pointer"
                }`}
                onClick={saveGame}
              />
            </div>
          </div>
        </div>

        <StatsTrackerTable game={game} />

        <h2 className="mt-4 text-center text-(--primary) text-2xl font-bold">
          Play By Play
        </h2>
        <div className="max-h-75 overflow-y-scroll scrollbar-hide border-2 border-(--secondary) w-full my-4 rounded-lg px-3 pt-1 pb-4">
          <h4 className="text-center text-(--primary) font-bold">
            {quarter.toUpperCase()}
          </h4>
          {[...game.playByPlay[quarter]].reverse().map((play, index) => (
            <p key={index} className="my-1 py-1 border-b-1 border-(--primary)">
              {play.playerName} {statsMap[play.stat]}
            </p>
          ))}
        </div>
      </div>

      <div className="flex flex-row justify-between">
        <button className={restartButtonStyling} onClick={confirmRestart}>
          Start Over
        </button>
        <button className={endButtonStyling} onClick={completeGame}>
          Finish Game
        </button>
      </div>

      {restartModal && (
        <ConfirmRestartModal
          setRestartModal={setRestartModal}
          deleteTrackedGame={deleteTrackedGame}
        />
      )}
    </>
  );
};

export default StatsTracker;
