import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const PieChartWithCustomizedLabel = ({ chartData }) => {
  // Colors for the pie chart slices
  const colors = [
    "#FF8042", // Changed
    "#FFBB28", 
    "#0088FE", 
    "#00C49F", 
    "#A0522D", // Changed from "#FFBB28"
    "#32CD32", // Changed from "#FF8042"
    "#8A2BE2", // Changed from "#00C49F"
    "#FFD700"  // Changed from "#FFBB28"
  ];
  

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={100}
          // label={({ name, value }) => `${name}: ${value}`}
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default PieChartWithCustomizedLabel;
