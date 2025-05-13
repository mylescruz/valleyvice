import { useState } from "react";

const StatsTrackerLayout = () => {
  const stats = [
    { id: 0, name: "2PM", value: "pm2" },
    { id: 1, name: "2PA", value: "pa2" },
    { id: 2, name: "3PM", value: "pm3" },
    { id: 3, name: "3PA", value: "pa3" },
    { id: 4, name: "FT", value: "ft" },
    { id: 5, name: "FTA", value: "fta" },
    { id: 6, name: "REB", value: "reb" },
    { id: 7, name: "AST", value: "ast" },
    { id: 8, name: "STL", value: "stl" },
    { id: 9, name: "BLK", value: "blk" },
    { id: 10, name: "TO", value: "to" },
    { id: 11, name: "PF", value: "pf" },
    { id: 12, name: "CKD", value: "ckd" },
  ];

  const roster = [
    {
      id: "andrewCh",
      name: "Andrew",
      number: 37,
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
    {
      id: "forrestGe",
      name: "Forrest",
      number: 17,
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
    {
      id: "jamesGe",
      name: "James",
      number: "00",
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
    {
      id: "johnnyCh",
      name: "Johnny",
      number: 11,
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
    {
      id: "jonahBa",
      name: "Jonah",
      number: 12,
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
    {
      id: "mylesCr",
      name: "Myles",
      number: 5,
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
    {
      id: "rustyPu",
      name: "Rusty",
      number: 3,
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
    {
      id: "waleedKh",
      name: "Waleed",
      number: 1,
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
    {
      id: "lindseyDr",
      name: "Lindsey",
      number: 14,
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
  ];

  const emptyStat = "";

  const [playerStats, setPlayerStats] = useState(roster);
  const [choosePlayer, setChoosePlayer] = useState(false);
  const [statSelected, setStatSelected] = useState(emptyStat);

  const chooseStat = (stat) => {
    setStatSelected(stat);
    setChoosePlayer(true);
  };

  const addStat = (playerId) => {
    const updatedStats = playerStats.map((player) => {
      if (player.id === playerId) {
        if (statSelected === "pm2") {
          player[statSelected] += 1;
          player.pa2 += 1;
        } else if (statSelected === "pm3") {
          player[statSelected] += 1;
          player.pa3 += 1;
        } else if (statSelected === "ft") {
          player[statSelected] += 1;
          player.fta += 1;
        } else {
          player[statSelected] += 1;
        }
      }

      return player;
    });

    setStatSelected(emptyStat);
    setChoosePlayer(false);
    setPlayerStats(updatedStats);
  };

  const playerCellsStyle = "w-1/18 p-1 text-center";

  return (
    <div className="flex flex-col items-center mt-4">
      <div className="w-11/12 sm:w-4/5">
        <h1 className="text-2xl font-bold text-(--primary) text-center">
          Track Stats
        </h1>
        {!choosePlayer ? (
          <div className="flex flex-row flex-wrap justify-center">
            {stats.map((stat) => (
              <div
                key={stat.id}
                className="border-2 border-(--secondary) w-[65px] aspect-square rounded-full flex flex-col items-center justify-center m-2 hover:bg-(--primary) hover:cursor-pointer hover:font-bold"
                onClick={() => chooseStat(stat.value)}
              >
                {stat.name}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-row flex-wrap justify-center">
            {playerStats.map((player) => (
              <div
                key={player.id}
                className="border-2 border-(--secondary) w-[65px] aspect-square rounded-full flex flex-col items-center justify-center m-2 hover:bg-(--primary) hover:cursor-pointer hover:font-bold"
                onClick={() => addStat(player.id)}
              >
                {player.name}
              </div>
            ))}
          </div>
        )}

        <div className="flex flex-col my-4 overflow-x-auto">
          <table>
            <thead className="border-b-1 border-white">
              <tr>
                <th className={playerCellsStyle}>PLR</th>
                <th className={playerCellsStyle}>PTS</th>
                <th className={playerCellsStyle}>2PM</th>
                <th className={playerCellsStyle}>2PA</th>
                <th className={playerCellsStyle}>2P%</th>
                <th className={playerCellsStyle}>3PM</th>
                <th className={playerCellsStyle}>3PA</th>
                <th className={playerCellsStyle}>3P%</th>
                <th className={playerCellsStyle}>FT</th>
                <th className={playerCellsStyle}>FTA</th>
                <th className={playerCellsStyle}>FT%</th>
                <th className={playerCellsStyle}>REB</th>
                <th className={playerCellsStyle}>AST</th>
                <th className={playerCellsStyle}>STL</th>
                <th className={playerCellsStyle}>BLK</th>
                <th className={playerCellsStyle}>TO</th>
                <th className={playerCellsStyle}>PF</th>
                <th className={playerCellsStyle}>CKD</th>
              </tr>
            </thead>
            <tbody>
              {playerStats.map((player) => (
                <tr key={player.id}>
                  <td className={playerCellsStyle}>{player.name}</td>
                  <td className={playerCellsStyle}>
                    {player.pm2 * 2 + player.pm3 * 3 + player.ft}
                  </td>
                  <td className={playerCellsStyle}>{player.pm2}</td>
                  <td className={playerCellsStyle}>{player.pa2}</td>
                  <td className={playerCellsStyle}>
                    {player.pa2 === 0
                      ? `0%`
                      : `${((player.pm2 / player.pa2) * 100).toFixed(0)}%`}
                  </td>
                  <td className={playerCellsStyle}>{player.pm3}</td>
                  <td className={playerCellsStyle}>{player.pa3}</td>
                  <td className={playerCellsStyle}>
                    {player.pa3 === 0
                      ? `0%`
                      : `${((player.pm3 / player.pa3) * 100).toFixed(0)}%`}
                  </td>
                  <td className={playerCellsStyle}>{player.ft}</td>
                  <td className={playerCellsStyle}>{player.fta}</td>
                  <td className={playerCellsStyle}>
                    {player.fta === 0
                      ? `0%`
                      : `${((player.ft / player.fta) * 100).toFixed(0)}%`}
                  </td>
                  <td className={playerCellsStyle}>{player.reb}</td>
                  <td className={playerCellsStyle}>{player.ast}</td>
                  <td className={playerCellsStyle}>{player.stl}</td>
                  <td className={playerCellsStyle}>{player.blk}</td>
                  <td className={playerCellsStyle}>{player.to}</td>
                  <td className={playerCellsStyle}>{player.pf}</td>
                  <td className={playerCellsStyle}>{player.ckd}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StatsTrackerLayout;
