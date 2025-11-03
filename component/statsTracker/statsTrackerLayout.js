import { faArrowRotateLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useEffect, useState } from "react";
import StatsTable from "./statsTable";
import LoadingIndicator from "../layout/loadingIndicator";
import CompleteGame from "./completeGame";
import GameInfoForm from "./gameInfoForm";
import { InfoContext } from "@/contexts/InfoContext";
import dateFormatter from "@/helpers/dateFormatter";

const emptyGame = {
  seasonNumber: "",
  gameNumber: "",
  date: "",
  location: "",
  opponent: "",
  valleyViceScore: "",
  opponentScore: "",
  result: "",
  teamStats: {
    points: 0,
    twoPointsMade: 0,
    twoPointsAttempted: 0,
    threePointsMade: 0,
    threePointsAttempted: 0,
    freeThrowsMade: 0,
    freeThrowsAttempted: 0,
    rebounds: 0,
    assists: 0,
    steals: 0,
    blocks: 0,
    turnovers: 0,
    personalFouls: 0,
    cooked: 0,
  },
  players: [],
  playByPlay: [],
  saved: false,
};

const stats = [
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

const StatsTrackerLayout = () => {
  const { info, infoLoading } = useContext(InfoContext);

  const [game, setGame] = useState(emptyGame);
  const [enterGameInfo, setEnterGameInfo] = useState(true);
  const [chooseStat, setChooseStat] = useState(true);
  const [choosePlayer, setChoosePlayer] = useState(false);
  const [chooseAssist, setChooseAssist] = useState(false);
  const [shotMaker, setShotMaker] = useState("");
  const [statSelected, setStatSelected] = useState("");
  const [gameFinished, setGameFinished] = useState(false);

  // Set the current roster to determine who is playing
  useEffect(() => {
    if (!infoLoading && info) {
      const currentRoster = info.currentRoster
        .filter((player) => player.playerId !== "vvSubs")
        .map((player) => {
          return {
            playerId: player.playerId,
            name: player.name,
            number: player.number,
            points: 0,
            twoPointsMade: 0,
            twoPointsAttempted: 0,
            threePointsMade: 0,
            threePointsAttempted: 0,
            freeThrowsMade: 0,
            freeThrowsAttempted: 0,
            rebounds: 0,
            assists: 0,
            steals: 0,
            blocks: 0,
            turnovers: 0,
            personalFouls: 0,
            cooked: 0,
          };
        })
        .sort((player1, player2) => player1.number - player2.number);

      setGame({ ...emptyGame, players: currentRoster });
    }
  }, [info, infoLoading]);

  const selectStat = (stat) => {
    setChooseStat(false);
    setStatSelected(stat);
    setChoosePlayer(true);
  };

  const selectAssister = (playerId) => {
    if (
      statSelected === "twoPointsMade" ||
      statSelected === "threePointsMade"
    ) {
      setChoosePlayer(false);
      setChooseAssist(true);
    } else {
      setChoosePlayer(false);
      addStat(playerId);
    }
  };

  // If someone assisted the made shot, include their stat
  const addAssist = (playerId) => {
    addStat(shotMaker);

    if (!playerId) {
      const updatedStats = game.players.map((player) => {
        if (player.playerId === playerId) {
          player.assists += 1;
          game.teamStats.assists += 1;
        }

        return player;
      });

      setGame({
        ...game,
        players: updatedStats,
        playByPlay: [
          ...game.playByPlay,
          { playerId: shotMaker, stat: statSelected },
          { playerId: playerId, stat: "assists" },
        ],
      });
    }

    setShotMaker("");
    setChooseAssist(false);
    setChooseStat(true);
  };

  // Add the stat recorded
  const addStat = (playerId) => {
    const updatedStats = game.players.map((player) => {
      if (player.playerId === playerId) {
        if (statSelected === "twoPointsMade") {
          // Update the player's individual stats
          player[statSelected] += 1;
          player.twoPointsAttempted += 1;
          player.points += 2;

          // Update the team's stats
          game.teamStats[statSelected] += 1;
          game.teamStats.twoPointsAttempted += 1;
          game.teamStats.points += 2;
        } else if (statSelected === "threePointsMade") {
          // Update the player's individual stats
          player[statSelected] += 1;
          player.threePointsAttempted += 1;
          player.points += 3;

          // Update the team's stats
          game.teamStats[statSelected] += 1;
          game.teamStats.threePointsAttempted += 1;
          game.teamStats.points += 3;
        } else if (statSelected === "freeThrowsMade") {
          // Update the player's individual stats
          player[statSelected] += 1;
          player.freeThrowsAttempted += 1;
          player.points += 1;

          // Update the team's stats
          game.teamStats[statSelected] += 1;
          game.teamStats.freeThrowsAttempted += 1;
          game.teamStats.points += 1;
        } else {
          // Update the player's individual stats
          player[statSelected] += 1;

          // Update the team's stats
          game.teamStats[statSelected] += 1;
        }
      }

      return player;
    });

    setStatSelected("");
    setGame({
      ...game,
      players: updatedStats,
      playByPlay: [
        ...game.playByPlay,
        { playerId: playerId, stat: statSelected },
      ],
      saved: false,
    });
    setChooseStat(true);
  };

  // Remove the last stat recorded
  const undoStat = () => {
    const playByPlayLength = game.playByPlay.length;
    if (playByPlayLength === 0) {
      return;
    }

    const lastStat = game.playByPlay[playByPlayLength - 1];

    const updatedStats = game.players.map((player) => {
      if (player.playerId === lastStat.playerId) {
        if (lastStat.stat === "twoPointsMade") {
          // Update the player's individual stats
          player[lastStat.stat] -= 1;
          player.twoPointsAttempted -= 1;
          player.points -= 2;

          // Update the team's stats
          game.teamStats[lastStat.stat] -= 1;
          game.teamStats.twoPointsAttempted -= 1;
          game.teamStats.points -= 2;
        } else if (lastStat.stat === "threePointsMade") {
          // Update the player's individual stats
          player[lastStat.stat] -= 1;
          player.threePointsAttempted -= 1;
          player.points -= 3;

          // Update the team's stats
          game.teamStats[lastStat.stat] -= 1;
          game.teamStats.threePointsAttempted -= 1;
          game.teamStats.points -= 3;
        } else if (lastStat.stat === "freeThrowsMade") {
          // Update the player's individual stats
          player[lastStat.stat] -= 1;
          player.freeThrowsAttempted -= 1;
          player.points -= 1;

          // Update the team's stats
          game.teamStats[lastStat.stat] -= 1;
          game.teamStats.freeThrowsAttempted -= 1;
          game.teamStats.points -= 1;
        } else {
          // Update the player's individual stats
          player[lastStat.stat] -= 1;

          // Update the team's stats
          game.teamStats[lastStat.stat] -= 1;
        }
      }

      return player;
    });

    setGame({
      ...game,
      players: updatedStats,
      playByPlay: game.playByPlay.slice(0, -1),
    });
  };

  const completeGame = () => {
    setGameFinished(true);
  };

  const buttonStyling =
    "font-bold rounded-lg mx-2 px-2 py-1 bg-(--secondary) hover:bg-(--primary) hover:cursor-pointer";
  const bubbleStyling =
    "border-2 border-(--secondary) w-[70px] aspect-square rounded-full flex flex-col items-center justify-center m-2 font-bold hover:bg-(--primary) hover:cursor-pointer";

  if (infoLoading && !info) {
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
                      {game.players.map((player) => (
                        <div
                          key={player.playerId}
                          className={bubbleStyling}
                          onClick={() => {
                            setShotMaker(player.playerId);
                            selectAssister(player.playerId);
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
                        onClick={() => addAssist(null)}
                      >
                        None
                      </div>
                      {game.players
                        .filter((player) => player.playerId !== shotMaker)
                        .map((player) => (
                          <div
                            key={player.playerId}
                            className={bubbleStyling}
                            onClick={() => addAssist(player.playerId)}
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
                          game.playByPlay.length === 0
                            ? "text-gray-500"
                            : "text-lg hover:text-(--primary) hover:cursor-pointer"
                        }`}
                        onClick={undoStat}
                      />
                    </div>
                  </div>

                  <StatsTable
                    players={game.players}
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
            emptyGame={emptyGame}
            setGameFinished={setGameFinished}
            setEnterGameInfo={setEnterGameInfo}
          />
        )}
      </>
    );
  }
};

export default StatsTrackerLayout;
