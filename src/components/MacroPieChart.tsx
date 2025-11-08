import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";

interface MacroPieChartProps {
  protein: number;
  carbs: number;
  fat: number;
}

export function MacroPieChart({ protein, carbs, fat }: MacroPieChartProps) {
  const data = [
    { name: "Protein", value: protein, color: "hsl(var(--primary))" },
    { name: "Carbs", value: carbs, color: "hsl(var(--accent))" },
    { name: "Fat", value: fat, color: "hsl(var(--gold))" },
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          outerRadius={100}
          fill="#8884d8"
          dataKey="value"
          animationBegin={0}
          animationDuration={800}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
