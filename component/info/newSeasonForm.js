import { useContext, useState } from "react";
import NewPlayerForm from "./newPlayerForm";
import { InfoContext } from "@/contexts/InfoContext";
import LoadingIndicator from "../layout/loadingIndicator";
import useSeason from "@/hooks/useSeason";

const seasonsOfYear = ["Winter", "Spring", "Summer", "Fall"];

const inputGroupStyling = "flex flex-col my-1.5 mx-2";
const inputStyling = "border-2 border-(--secondary) rounded-lg py-1 px-2";
const buttonStyling =
  "font-bold rounded-lg ml-4 px-2 py-1 hover:bg-(--primary) hover:cursor-pointer";

const NewSeasonForm = ({
  newSeason,
  setNewSeason,
  emptySeason,
  setInputNewSeason,
}) => {
  const { info } = useContext(InfoContext);

  const { postSeason } = useSeason(info.currentSeason);

  const [inputPlayer, setInputPlayer] = useState(false);
  const [roster, setRoster] = useState(info.currentRoster);
  const [savingSeason, setSavingSeason] = useState(false);

  const handleInput = (e) => {
    const input = e.target.value;

    setNewSeason({ ...newSeason, [e.target.id]: input });
  };

  const handleNumInput = (e) => {
    const input = e.target.value;

    if (input === "") {
      setNewSeason({ ...newSeason, [e.target.id]: input });
    } else {
      setNewSeason({ ...newSeason, [e.target.id]: parseInt(input) });
    }
  };

  const handlePlayers = (playerId) => {
    const foundPlayer = roster.find((player) => player.playerId === playerId);

    if (foundPlayer) {
      const playerAdded = newSeason.players.find(
        (player) => player.playerId === playerId,
      );

      if (playerAdded) {
        const updatedPlayers = newSeason.players.filter(
          (player) => player.playerId !== playerId,
        );
        setNewSeason({ ...newSeason, players: updatedPlayers });
      } else {
        setNewSeason({
          ...newSeason,
          players: [...newSeason.players, foundPlayer],
        });
      }
    } else {
      console.log("Not found");
    }
  };

  const enterNewPlayer = () => {
    setInputPlayer(true);
  };

  const saveNewSeason = async (e) => {
    e.preventDefault();

    try {
      setSavingSeason(true);

      await postSeason(newSeason);

      setNewSeason(emptySeason);

      setInputNewSeason(false);
    } catch (error) {
      console.error("New season error: ", error);
      window.alert(
        "Error saving the new season. Check the console for the error",
      );
      return;
    } finally {
      setSavingSeason(false);
    }
  };

  const cancelNewSeason = () => {
    setNewSeason(emptySeason);
    setInputNewSeason(false);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="fixed top-0 left-0 w-[100%] h-[100%] bg-[rgba(255,255,255,0.2)] z-50 flex flex-col justify-center items-center">
        <div className="w-2/3 bg-(--background) p-4 rounded-lg flex flex-col items-center">
          <form
            className="w-full my-4 flex flex-col items-center px-8"
            onSubmit={saveNewSeason}
          >
            <div className="flex flex-col md:flex-row md:justify-center">
              <div className="flex flex-col">
                <div className={inputGroupStyling}>
                  <label htmlFor="seasonNumber">Season #</label>
                  <input
                    id="seasonNumber"
                    type="number"
                    onChange={handleNumInput}
                    className={inputStyling}
                    value={newSeason.seasonNumber}
                    required
                  />
                </div>
                <div className={inputGroupStyling}>
                  <label htmlFor="season">Season</label>
                  <select
                    id="season"
                    className="p-2 border-1 border-(--secondary) rounded-lg"
                    onChange={handleInput}
                    value={newSeason.season}
                    required
                  >
                    {seasonsOfYear.map((season, index) => (
                      <option key={index} value={season}>
                        {season}
                      </option>
                    ))}
                  </select>
                </div>
                <div className={inputGroupStyling}>
                  <label htmlFor="year">Year</label>
                  <input
                    id="year"
                    type="number"
                    onChange={handleNumInput}
                    className={inputStyling}
                    value={newSeason.year}
                    required
                  />
                </div>
                <div className={inputGroupStyling}>
                  <label htmlFor="league">League</label>
                  <input
                    id="league"
                    type="text"
                    onChange={handleInput}
                    className={inputStyling}
                    value={newSeason.league}
                    required
                  />
                </div>
                <div className={inputGroupStyling}>
                  <label htmlFor="division">Division</label>
                  <input
                    id="division"
                    type="text"
                    onChange={handleInput}
                    className={inputStyling}
                    value={newSeason.division}
                    required
                  />
                </div>
              </div>
              <div className="flex flex-col items-center mt-1.5">
                <p>Who is playing this season?</p>
                <div className="flex flex-row flex-wrap justify-center lg:w-3/4 xl:w-4/5">
                  {roster.map((player) => (
                    <div
                      key={player.playerId}
                      className={`border-2 border-(--secondary) w-[65px] aspect-square rounded-full flex flex-col items-center justify-center m-2 hover:bg-(--primary) hover:cursor-pointer hover:font-bold ${
                        newSeason.players
                          .map((player) => player.playerId)
                          .includes(player.playerId) &&
                        "bg-(--primary) font-bold"
                      }`}
                      onClick={() => {
                        handlePlayers(player.playerId);
                      }}
                    >
                      {player.name}
                    </div>
                  ))}
                  <div
                    className="border-2 border-(--secondary) w-[65px] aspect-square rounded-full flex flex-col items-center justify-center m-2 hover:bg-(--primary) hover:cursor-pointer hover:font-bold"
                    onClick={enterNewPlayer}
                  >
                    New
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-2 text-center">
              <button
                className={`${buttonStyling} bg-gray-500`}
                onClick={cancelNewSeason}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`${buttonStyling} bg-(--secondary)`}
              >
                Enter
              </button>
            </div>
          </form>
        </div>
      </div>

      {inputPlayer && (
        <NewPlayerForm
          roster={roster}
          setRoster={setRoster}
          newSeason={newSeason}
          setNewSeason={setNewSeason}
          setInputPlayer={setInputPlayer}
        />
      )}

      {savingSeason && (
        <div className="fixed top-0 left-0 w-[100%] h-[100%] bg-[rgba(255,255,255,0.2)] z-50 flex flex-col justify-center items-center">
          <div className="w-2/5 bg-(--background) p-4 rounded-lg flex flex-col justify-center items-center">
            <h1 className="text-xl text-center">Saving New Season</h1>
            <LoadingIndicator />
          </div>
        </div>
      )}
    </div>
  );
};

export default NewSeasonForm;
