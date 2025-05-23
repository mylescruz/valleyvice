const seasonSorter = (season) => {
  season.sort((a, b) => {
    if (parseInt(a.seasonNumber) < parseInt(b.seasonNumber)) {
      return 1;
    } else if (parseInt(a.seasonNumber) > parseInt(b.seasonNumber)) {
      return -1;
    } else {
      return 0;
    }
  });

  return season;
};

export default seasonSorter;
