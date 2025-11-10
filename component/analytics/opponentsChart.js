import { Bar, BarChart, Legend, Tooltip, XAxis, YAxis } from "recharts";

const OpponentsChart = ({ opponents }) => {
  return (
    <BarChart
      style={{
        width: "100%",
        maxWidth: "700px",
        maxHeight: "100vh",
        aspectRatio: 1.618,
      }}
      data={opponents}
      margin={{ top: 5, right: 0, left: 0, bottom: 2 }}
    >
      <XAxis
        dataKey="opponent"
        interval={0}
        tick={{ fill: "var(--foreground)", fontSize: 12 }}
        tickLine={true}
        axisLine={{ stroke: "var(--foreground" }}
      />
      <YAxis
        width="auto"
        tick={{ fill: "var(--foreground)", fontSize: 12 }}
        tickLine={true}
        axisLine={{ stroke: "var(--foreground" }}
      />
      <Tooltip
        contentStyle={{
          backgroundColor: "var(--background)",
          border: "var(--primary)",
          fontWeight: "bold",
        }}
      />
      <Legend />
      <Bar dataKey="wins" fill="var(--primary)" />
      <Bar dataKey="games" fill="var(--secondary)" />
    </BarChart>
  );
};

export default OpponentsChart;
