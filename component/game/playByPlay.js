import { useState } from "react";

const PlayByPlay = ({ playByPlay }) => {
  const [plays, setPlays] = useState(
    playByPlay.length === 4 ? playByPlay[0] : playByPlay
  );

  const quartersLegend = ["1st", "2nd", "3rd", "4th"];

  const chooseQuarter = (quarterIndex) => {
    setPlays(playByPlay[quarterIndex]);
  };

  const quarterStyling =
    "font-bold rounded-lg mx-2 px-2 py-1 bg-(--secondary) hover:bg-(--primary) hover:cursor-pointer";
  const selectedQuarterStyling =
    "font-bold rounded-lg mx-2 px-2 py-1 bg-(--primary) hover:bg-(--secondary) hover:cursor-pointer";

  return (
    <div className="w-11/12 md:w-3/5 lg:w-1/3">
      <h1 className="text-(--primary) font-bold text-lg text-center mb-2">
        Play-By-Play
      </h1>
      {playByPlay.length === 4 && (
        <div className="flex flex-row justify-evenly">
          {quartersLegend.map((quarter, index) => (
            <div key={index} className={quarterStyling}>
              <p className="text-sm" onClick={() => chooseQuarter(index)}>
                {quarter} <span className="hidden md:inline">Quarter</span>
              </p>
            </div>
          ))}
        </div>
      )}
      <div className="max-h-75 overflow-y-scroll scrollbar-hide border-2 border-(--secondary) w-full my-4 rounded-lg px-3 pt-1 pb-4">
        {plays.map((play, index) => (
          <p key={index} className="my-1 py-1 border-b-1 border-(--primary)">
            {play}
          </p>
        ))}
      </div>
    </div>
  );
};

export default PlayByPlay;
