"use client";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function CustomPieChart({ data = [], colors = [], title }) {
  const defaultColors = [
    "#22C55E", // green
    "#EF4444", // red
    "#F59E0B", // amber
    "#3B82F6", // blue
    "#D946EF", // pink
  ];

  const total = data.reduce((acc, cur) => acc + cur.value, 0);

  return (
    <div className="relative w-full max-w-full h-[400px] sm:h-[500px] flex flex-col items-center justify-center bg-white shadow-md rounded-2xl p-4 sm:p-6">
      {title && <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">{title}</h2>}

      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius="40%"
            outerRadius="70%"
            paddingAngle={4}
            cornerRadius={8}
            dataKey="value"
            label={({ name, value, percent }) =>
              `${name}: ${value} (${(percent * 100).toFixed(0)}%)`
            }
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={
                  colors.length
                    ? colors[index % colors.length]
                    : defaultColors[index % defaultColors.length]
                }
              />
            ))}
          </Pie>

          <Tooltip
            formatter={(value, name) => [`${value}`, `${name}`]}
            contentStyle={{
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
          />
        </PieChart>
      </ResponsiveContainer>

      {/* total au centre */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none">
        <span className="text-base sm:text-lg font-semibold">Total</span>
        <span className="text-xl sm:text-2xl font-bold text-indigo-600">{total}</span>
      </div>
    </div>
  );
}
