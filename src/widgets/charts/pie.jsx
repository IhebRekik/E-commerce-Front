"use client";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function CustomPieChart({ data, colors, title }) {
  const defaultColors = [
     // indigo
    "#22C55E",
    "#EF4444", // green
    "#F59E0B", // amber
     // red
    "#3B82F6", // blue
    "#D946EF", // pink
  ];

  // calcul du total
  const total = data.reduce((acc, cur) => acc + cur.value, 0);

  return (
    <div className="w-full h-[500px] flex flex-col items-center justify-center bg-white shadow-md rounded-2xl p-6">
      {title && <h2 className="text-2xl font-bold mb-6">{title}</h2>}
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={80}    // donut
            outerRadius={150}   // plus grand
            paddingAngle={4}    // espace entre les parts
            cornerRadius={8}    // arrondir les angles
            dataKey="value"
            label={({ name, value, percent }) =>
              `${name}: ${value} (${(percent * 100).toFixed(0)}%)`
            }
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={
                  colors && colors.length > 0
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
      <div className="absolute flex flex-col items-center">
        <span className="text-lg font-semibold">Total</span>
        <span className="text-2xl font-bold text-indigo-600">{total}</span>
      </div>
    </div>
  );
}
