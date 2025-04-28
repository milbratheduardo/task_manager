import React from 'react';
import { BarChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, Bar } from 'recharts';

interface PriorityData {
  priority: string;
  count: number;
}

interface CustomBarChartProps {
  data: PriorityData[];
}

const CustomBarChart = ({ data }: CustomBarChartProps) => {

  const getBarColor = (entry: PriorityData) => {
    switch (entry.priority) {
      case "Baixa": return '#00BC7D';
      case "Média": return '#FE9900';
      case "Alta": return '#FF1F57';
      default: return '#00BC7D';
    }
  };

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: any[] }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white shadow-md rounded-lg p-2 border border-gray-300">
          <p className="text-xs font-semibold text-purple-800 mb-1">
            {payload[0].payload.priority}
          </p>
          <p className="text-sm text-gray-600">
            Contagem:{" "}
            <span className="text-sm font-medium text-gray-900">
              {payload[0].payload.count}
            </span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis 
            dataKey="priority" 
            tick={{ fontSize: 12, fill: "#555" }}
            stroke="#ccc"
          />
          <YAxis 
            tick={{ fontSize: 12, fill: "#555" }} 
            stroke="#ccc" 
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "transparent" }} />

          <Bar
            dataKey="count"
            radius={[8, 8, 0, 0]}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getBarColor(entry)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CustomBarChart;
