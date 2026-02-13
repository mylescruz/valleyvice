import { Bar, BarChart, Tooltip, XAxis, YAxis } from "recharts";

const TotalLeadersChart = ({ totalLeaders }) => {
  return (
    <BarChart
      style={{
        width: "100%",
        maxWidth: "700px",
        maxHeight: "70vh",
        aspectRatio: 1.618,
      }}
      responsive
      data={totalLeaders}
      margin={{
        top: 5,
        right: 0,
        left: 0,
        bottom: 5,
      }}
    >
      <XAxis
        dataKey="stat"
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
        formatter={(value, name, props) => [
          `${props.payload.name} ${props.payload.value}`,
          "",
        ]}
      />
      <Bar dataKey="value" fill="var(--primary)" />
    </BarChart>
  );
};

export default TotalLeadersChart;
