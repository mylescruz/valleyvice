import { useState } from "react";

const statsLegend = {
  twoPointsMade: "Two Points Made",
  twoPointsAttempted: "Two Points Attempted",
  threePointsMade: "Three Points Made",
  threePointsAttempted: "Three Points Attempted",
  freeThrowsMade: "Free Throws Made",
  freeThrowsAttempted: "Free Throws Attempted",
  rebounds: "Rebounds",
  assists: "Assists",
  steals: "Steals",
  blocks: "Blocks",
  turnovers: "Turnovers",
  personalFouls: "Personal Fouls",
  cooked: "Cooked",
};

const statsValidation = {
  allStats: { valid: true, error: "" },
  twoPointsMade: { valid: true, error: "" },
  threePointsMade: { valid: true, error: "" },
  freeThrowsMade: { valid: true, error: "" },
};

const buttonStyling =
  "font-bold rounded-lg px-2 py-1 hover:bg-(--primary) hover:cursor-pointer";
const inputLabelStyling = "font-bold col-span-9";
const statInputStyling =
  "border-2 border-(--secondary) rounded-lg py-1 px-2 w-full col-span-3";

const EditPlayerStatsModal = ({
  editedPlayer,
  setEditedPlayer,
  setOpenEditModal,
  updatePlayerStats,
}) => {
  const [validStats, setValidStats] = useState(statsValidation);

  const handleInput = (e) => {
    const input = e.target.value === "" ? "" : Number(e.target.value);

    setEditedPlayer((prev) => ({
      ...prev,
      [e.target.id]: input,
    }));
  };

  const closeEdit = () => {
    setOpenEditModal(false);
  };

  const updateStats = (e) => {
    e.preventDefault();

    // Check that the player's shot attempts are greater than the makes
    let valid = true;

    const errors = { ...statsValidation };

    if (editedPlayer.twoPointsAttempted < editedPlayer.twoPointsMade) {
      errors.twoPointsMade = {
        valid: false,
        error: "Cannot have more two points made than attempted",
      };

      valid = false;
    }

    if (editedPlayer.threePointsAttempted < editedPlayer.threePointsMade) {
      errors.threePointsMade = {
        valid: false,
        error: "Cannot have more three points made than attempted",
      };

      valid = false;
    }

    if (editedPlayer.freeThrowsAttempted < editedPlayer.freeThrowsMade) {
      errors.freeThrowsMade = {
        valid: false,
        error: "Cannot have more free throws made than attempted",
      };

      valid = false;
    }

    if (!valid) {
      errors.allStats = {
        valid: false,
        error:
          "There are errors for this player's stats. Please check what you input.",
      };

      setValidStats(errors);
      return;
    }

    // Finalize the player's points
    const updatedPlayer = {
      ...editedPlayer,
      points:
        editedPlayer.twoPointsMade * 2 +
        editedPlayer.threePointsMade * 3 +
        editedPlayer.freeThrowsMade,
    };

    updatePlayerStats(updatedPlayer);

    closeEdit();
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-(--shadow) z-50 flex flex-col justify-center items-center">
      <div className="w-11/12 sm:w-1/2 lg:w-1/3 xl:w-1/4 h-[90%] md:h-[75%] bg-(--background) p-4 rounded-lg my-4 md:my-0 flex flex-col overflow-y-auto">
        <form className="flex flex-col my-4" onSubmit={updateStats}>
          <h2 className="text-xl font-bold text-(--primary) text-center md:text-start">
            Edit Stats for {editedPlayer.name}
          </h2>
          <div className="flex flex-col my-4">
            {Object.keys(statsLegend).map((key) => (
              <div key={key} className="flex flex-col my-2">
                <div className="grid grid-cols-12 items-center">
                  <label htmlFor={key} className={inputLabelStyling}>
                    {statsLegend[key]}
                  </label>
                  <input
                    type="number"
                    id={key}
                    min={0}
                    max={99}
                    className={statInputStyling}
                    value={editedPlayer[key]}
                    onChange={handleInput}
                    required
                  />
                </div>
                {!validStats[key]?.valid && (
                  <p className="mx-2 text-(--secondary)">
                    {validStats[key]?.error}
                  </p>
                )}
              </div>
            ))}
          </div>
          {!validStats.allStats.valid && (
            <p className="text-(--secondary) text-center mb-4">
              {validStats.allStats.error}
            </p>
          )}
          <div className="w-full flex flex-row justify-between">
            <button
              className={`${buttonStyling} bg-gray-500`}
              onClick={closeEdit}
            >
              Cancel
            </button>
            <button
              className={`${buttonStyling} bg-(--secondary)`}
              type="submit"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPlayerStatsModal;
