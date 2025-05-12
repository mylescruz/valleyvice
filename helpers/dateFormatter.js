export default function dateFormatter(date) {
  const formattedDate = new Date(date);
  return formattedDate.toLocaleDateString("en-US", {
    timeZone: "UTC",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
