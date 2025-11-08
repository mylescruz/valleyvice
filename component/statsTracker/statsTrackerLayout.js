import { useContext, useEffect, useState } from "react";
import LoadingIndicator from "../layout/loadingIndicator";
import CompleteGame from "./completeGame";
import GameInfoForm from "./gameInfoForm";
import { InfoContext } from "@/contexts/InfoContext";
import useTrackedGame from "@/hooks/useTrackedGame";
import StatsTracker from "./statsTracker";
import ErrorLayout from "../layout/errorLayout";

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
  playByPlay: {
    quarter1: [],
    quarter2: [],
    quarter3: [],
    quarter4: [],
  },
  currentlyTracking: false,
};

const StatsTrackerLayout = () => {
  const { info, infoLoading } = useContext(InfoContext);
  const {
    trackedGame,
    trackedGameLoading,
    postTrackedGame,
    deleteTrackedGame,
  } = useTrackedGame();

  const [game, setGame] = useState(emptyGame);
  const [enterGameInfo, setEnterGameInfo] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);

  // Set the tracked game to the previous tracked game or an empty game
  useEffect(() => {
    if (!trackedGameLoading && trackedGame && !infoLoading && info) {
      setGame(trackedGame);
      setEnterGameInfo(false);
    } else {
      setGame({
        ...emptyGame,
        seasonNumber: info.currentSeason,
        gameNumber: info.lastGameNumberPlayed + 1,
      });
      setEnterGameInfo(true);
    }
  }, [trackedGame, trackedGameLoading, infoLoading, info]);

  if (trackedGameLoading && infoLoading) {
    return <LoadingIndicator />;
  } else if (info) {
    return (
      <>
        <div className="flex flex-col items-center mt-4">
          <div className="w-11/12 sm:w-4/5">
            {enterGameInfo ? (
              <GameInfoForm
                game={game}
                setGame={setGame}
                setEnterGameInfo={setEnterGameInfo}
              />
            ) : (
              <StatsTracker
                game={game}
                setGame={setGame}
                postTrackedGame={postTrackedGame}
                setGameFinished={setGameFinished}
              />
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
            deleteTrackedGame={deleteTrackedGame}
          />
        )}
      </>
    );
  } else {
    return <ErrorLayout />;
  }
};

export default StatsTrackerLayout;
