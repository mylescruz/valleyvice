import {
  faArrowRotateLeft,
  faFloppyDisk,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import StatsTrackerTable from "./statsTrackerTable";
import dateFormatter from "@/helpers/dateFormatter";
import { useState } from "react";

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

const StatsTracker = ({ game, setGame, postTrackedGame, setGameFinished }) => {
  const [quarter, setQuarter] = useState("quarter1");
  const [chooseStat, setChooseStat] = useState(true);
  const [choosePlayer, setChoosePlayer] = useState(false);
  const [chooseAssist, setChooseAssist] = useState(false);
  const [shotMaker, setShotMaker] = useState("");
  const [statSelected, setStatSelected] = useState("");

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
    setChooseStat(false);
    setStatSelected(stat);
    setChoosePlayer(true);
  };

  const selectAssister = (player) => {
    if (
      statSelected === "twoPointsMade" ||
      statSelected === "threePointsMade"
    ) {
      setChoosePlayer(false);
      setChooseAssist(true);
    } else {
      setChoosePlayer(false);
      addStat(player);
    }
  };

  // If someone assisted the made shot, include their stat
  const addAssist = (selectedPlayer) => {
    addStat(shotMaker);

    if (selectedPlayer) {
      const teamStats = game.teamStats;

      const updatedStats = game.players.map((player) => {
        if (player.playerId === selectedPlayer.playerId) {
          player.assists += 1;
          teamStats.assists += 1;
        }

        return player;
      });

      const playByPlay = {
        ...game.playByPlay,
        [quarter]: [
          ...game.playByPlay[quarter],
          {
            playerId: shotMaker.playerId,
            playerName: shotMaker.name,
            stat: statSelected,
          },
          {
            playerId: selectedPlayer.playerId,
            playerName: selectedPlayer.name,
            stat: "assists",
          },
        ],
      };

      setGame({
        ...game,
        players: updatedStats,
        teamStats: teamStats,
        playByPlay: playByPlay,
      });
    }

    setShotMaker("");
    setChooseAssist(false);
    setChooseStat(true);
  };

  // Add the stat recorded
  const addStat = (selectedPlayer) => {
    const teamStats = game.teamStats;

    const updatedStats = game.players.map((player) => {
      if (player.playerId === selectedPlayer.playerId) {
        if (statSelected === "twoPointsMade") {
          // Update the player's individual stats
          player[statSelected] += 1;
          player.twoPointsAttempted += 1;
          player.points += 2;

          // Update the team's stats
          teamStats[statSelected] += 1;
          teamStats.twoPointsAttempted += 1;
          teamStats.points += 2;
        } else if (statSelected === "threePointsMade") {
          // Update the player's individual stats
          player[statSelected] += 1;
          player.threePointsAttempted += 1;
          player.points += 3;

          // Update the team's stats
          teamStats[statSelected] += 1;
          teamStats.threePointsAttempted += 1;
          teamStats.points += 3;
        } else if (statSelected === "freeThrowsMade") {
          // Update the player's individual stats
          player[statSelected] += 1;
          player.freeThrowsAttempted += 1;
          player.points += 1;

          // Update the team's stats
          teamStats[statSelected] += 1;
          teamStats.freeThrowsAttempted += 1;
          teamStats.points += 1;
        } else {
          // Update the player's individual stats
          player[statSelected] += 1;

          // Update the team's stats
          teamStats[statSelected] += 1;
        }
      }

      return player;
    });

    const playByPlay = {
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

    setStatSelected("");
    setGame({
      ...game,
      players: updatedStats,
      teamStats: teamStats,
      playByPlay: playByPlay,
      currentlyTracking: false,
    });
    setChooseStat(true);
  };

  // Remove the last stat recorded
  const undoStat = () => {
    const playByPlayLength = game.playByPlay[quarter].length;

    if (playByPlayLength === 0) {
      return;
    }

    const lastStat = game.playByPlay[quarter][playByPlayLength - 1];
    const teamStats = game.teamStats;

    const updatedStats = game.players.map((player) => {
      if (player.playerId === lastStat.playerId) {
        if (lastStat.stat === "twoPointsMade") {
          // Update the player's individual stats
          player[lastStat.stat] -= 1;
          player.twoPointsAttempted -= 1;
          player.points -= 2;

          // Update the team's stats
          teamStats[lastStat.stat] -= 1;
          teamStats.twoPointsAttempted -= 1;
          teamStats.points -= 2;
        } else if (lastStat.stat === "threePointsMade") {
          // Update the player's individual stats
          player[lastStat.stat] -= 1;
          player.threePointsAttempted -= 1;
          player.points -= 3;

          // Update the team's stats
          teamStats[lastStat.stat] -= 1;
          teamStats.threePointsAttempted -= 1;
          teamStats.points -= 3;
        } else if (lastStat.stat === "freeThrowsMade") {
          // Update the player's individual stats
          player[lastStat.stat] -= 1;
          player.freeThrowsAttempted -= 1;
          player.points -= 1;

          // Update the team's stats
          teamStats[lastStat.stat] -= 1;
          teamStats.freeThrowsAttempted -= 1;
          teamStats.points -= 1;
        } else {
          // Update the player's individual stats
          player[lastStat.stat] -= 1;

          // Update the team's stats
          teamStats[lastStat.stat] -= 1;
        }
      }

      return player;
    });

    setGame({
      ...game,
      players: updatedStats,
      teamStats: teamStats,
      playByPlay: {
        ...game.playByPlay,
        [quarter]: game.playByPlay[quarter].slice(0, -1),
      },
      currentlyTracking: false,
    });
  };

  const saveGame = async () => {
    setGame({ ...game, currentlyTracking: true });
    await postTrackedGame({ ...game, currentlyTracking: true });
  };

  const completeGame = () => {
    setGame({ ...game, valleyViceScore: game.teamStats.points });
    setGameFinished(true);
  };

  const quarterStyling =
    "font-bold rounded-lg mx-2 px-2 py-1 bg-(--secondary) hover:bg-(--primary) hover:cursor-pointer";
  const selectedQuarterStyling =
    "font-bold rounded-lg mx-2 px-2 py-1 bg-(--primary) hover:bg-(--secondary) hover:cursor-pointer";
  const buttonStyling =
    "font-bold rounded-lg mx-2 px-2 py-1 bg-(--secondary) hover:bg-(--primary) hover:cursor-pointer";
  const bubbleStyling =
    "border-2 border-(--secondary) w-[70px] aspect-square rounded-full flex flex-col items-center justify-center m-2 font-bold hover:bg-(--primary) hover:cursor-pointer";

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
      {chooseStat && (
        <>
          <h2 className="text-center my-2 text-lg">Choose a stat</h2>
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
      {choosePlayer && (
        <>
          <h2 className="text-center my-2 text-lg">Choose a player</h2>
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
      {chooseAssist && (
        <>
          <h2 className="text-center my-2 text-lg">Who assisted?</h2>
          <div className="flex flex-row flex-wrap justify-center">
            <div className={bubbleStyling} onClick={() => addAssist(null)}>
              None
            </div>
            {game.players
              .filter((player) => player.playerId !== shotMaker.playerId)
              .map((player) => (
                <div
                  key={player.playerId}
                  className={bubbleStyling}
                  onClick={() => addAssist(player)}
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
              {game.currentlyTracking && <p className="text-sm mr-4">Saved</p>}
              <FontAwesomeIcon
                icon={faFloppyDisk}
                className={`${
                  game.currentlyTracking
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
        <h4 className="text-center text-(--primary) font-bold">
          {quarter.toUpperCase()}
        </h4>
        <div className="max-h-75 overflow-y-scroll scrollbar-hide border-2 border-(--secondary) w-full my-4 rounded-lg px-3 pt-1 pb-4">
          {game.playByPlay[quarter].map((play, index) => (
            <p key={index} className="my-1 py-1 border-b-1 border-(--primary)">
              {play.playerName} - {play.stat}
            </p>
          ))}
        </div>
      </div>

      <div className="flex flex-col items-end">
        <button className={buttonStyling} onClick={completeGame}>
          Game Over
        </button>
      </div>
    </>
  );
};

export default StatsTracker;
