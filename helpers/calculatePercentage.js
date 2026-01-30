export default function calculatePercentage(makes, attempts) {
  if (attempts === 0) {
    return 0;
  }

  return Math.round((makes / attempts) * 100);
}
