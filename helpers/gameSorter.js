const gameSorter = (games) => {
  games.sort((a, b) => {
    if (parseInt(a.gameNumber) > parseInt(b.gameNumber)) {
      return 1;
    } else if (parseInt(a.gameNumber) < parseInt(b.gameNumber)) {
      return -1;
    } else {
      return 0;
    }
  });

  return games;
};

export default gameSorter;
