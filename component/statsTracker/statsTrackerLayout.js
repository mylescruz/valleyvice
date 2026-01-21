import { useEffect, useState } from "react";
import LoadingIndicator from "../layout/loadingIndicator";
import CompleteGame from "./completeGame";
import GameInfoForm from "./gameInfoForm";
import useTrackedGame from "@/hooks/useTrackedGame";
import StatsTracker from "./statsTracker";
import useInfo from "@/hooks/useInfo";

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
  const { info, infoLoading } = useInfo();
  const {
    trackedGame,
    trackedGameLoading,
    postTrackedGame,
    deleteTrackedGame,
  } = useTrackedGame();

  const [game, setGame] = useState(emptyGame);
  const [screen, setScreen] = useState("info");
  const [completeModal, setCompleteModal] = useState(false);

  // Set the tracked game to the previous tracked game or an empty game
  useEffect(() => {
    if (!info) {
      return;
    }

    if (trackedGame) {
      setGame(trackedGame);
      setScreen("tracker");
    } else {
      setGame({
        ...emptyGame,
        seasonNumber: info.currentSeason,
        gameNumber: info.lastGameNumberPlayed + 1,
      });
      setScreen("info");
    }
  }, [trackedGame, info]);

  if (trackedGameLoading || infoLoading) {
    return <LoadingIndicator />;
  } else if (!info) {
    return (
      <div className="text-center">
        <p className="text-red-600 font-bold">
          Error loading the tracker! Please try again later!
        </p>
      </div>
    );
  } else {
    return (
      <>
        <div className="flex flex-col items-center mt-4">
          <div className="w-11/12 sm:w-4/5">
            {screen === "info" && (
              <GameInfoForm
                info={info}
                game={game}
                setGame={setGame}
                setScreen={setScreen}
              />
            )}
            {screen !== "info" && (
              <StatsTracker
                game={game}
                setGame={setGame}
                postTrackedGame={postTrackedGame}
                setScreen={setScreen}
                setCompleteModal={setCompleteModal}
              />
            )}
          </div>
        </div>

        {completeModal && (
          <CompleteGame
            game={game}
            setGame={setGame}
            emptyGame={emptyGame}
            setScreen={setScreen}
            setCompleteModal={setCompleteModal}
            deleteTrackedGame={deleteTrackedGame}
          />
        )}
      </>
    );
  }
};

export default StatsTrackerLayout;
