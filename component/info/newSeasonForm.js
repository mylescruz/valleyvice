import { useContext, useState } from "react";
import NewPlayerForm from "./newPlayerForm";
import { InfoContext } from "@/contexts/InfoContext";
import LoadingIndicator from "../layout/loadingIndicator";

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
  const { info, infoLoading } = useContext(InfoContext);

  const [inputPlayer, setInputPlayer] = useState(false);
  const [roster, setRoster] = useState(info.currentPlayers);

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
    const foundPlayer = roster.find((player) => player.id === playerId);

    if (foundPlayer) {
      const playerAdded = newSeason.players.find(
        (player) => player.id === playerId
      );

      if (playerAdded) {
        const updatedPlayers = newSeason.players.filter(
          (player) => player.id !== playerId
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

  const saveNewSeason = (e) => {
    e.preventDefault();

    newSeason.id = "s" + newSeason.seasonNumber;
    console.log(newSeason);

    setNewSeason(emptySeason);

    setInputNewSeason(false);
  };

  const cancelNewSeason = () => {
    setNewSeason(emptySeason);
    setInputNewSeason(false);
  };

  if (infoLoading) {
    return <LoadingIndicator />;
  } else {
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
                        key={player.id}
                        className={`border-2 border-(--secondary) w-[65px] aspect-square rounded-full flex flex-col items-center justify-center m-2 hover:bg-(--primary) hover:cursor-pointer hover:font-bold ${
                          newSeason.players
                            .map((player) => player.id)
                            .includes(player.id) && "bg-(--primary) font-bold"
                        }`}
                        onClick={() => {
                          handlePlayers(player.id);
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
                  className={`${buttonStyling} bg-gray-300`}
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
      </div>
    );
  }
};

export default NewSeasonForm;
