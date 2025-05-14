const rosterSorter = (roster) => {
  roster.sort((a, b) => {
    if (parseInt(a.number) > parseInt(b.number)) {
      return 1;
    } else if (parseInt(a.number) < parseInt(b.number)) {
      return -1;
    } else {
      return 0;
    }
  });

  return roster;
};

export default rosterSorter;
