'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface DonutChartProps {
  data: { name: string; value: number; color?: string }[];
  innerRadius?: number;
  outerRadius?: number;
  showLegend?: boolean;
  showTooltip?: boolean;
  centerText?: string;
  centerSubtext?: string;
}

const COLORS = ['#C9A962', '#87CEEB', '#DDA0DD', '#4ADE80', '#F87171', '#FBBF24', '#A78BFA', '#34D399'];

export default function DonutChart({
  data,
  innerRadius = 60,
  outerRadius = 80,
  showLegend = true,
  showTooltip = true,
  centerText,
  centerSubtext,
}: DonutChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="relative w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            paddingAngle={2}
            dataKey="value"
            animationBegin={0}
            animationDuration={1000}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.color || COLORS[index % COLORS.length]}
                stroke="transparent"
              />
            ))}
          </Pie>
          {showTooltip && (
            <Tooltip
              contentStyle={{
                backgroundColor: '#1A1A1D',
                border: '1px solid rgba(201, 169, 98, 0.2)',
                borderRadius: '8px',
                color: '#F5F3EF',
              }}
              formatter={(value: number) => [value.toLocaleString(), 'Count']}
            />
          )}
          {showLegend && (
            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={(value) => <span className="text-[#F5F3EF]/70 text-sm">{value}</span>}
            />
          )}
        </PieChart>
      </ResponsiveContainer>

      {(centerText || centerSubtext) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          {centerText && (
            <span className="text-2xl font-bold text-[#C9A962]">{centerText}</span>
          )}
          {centerSubtext && (
            <span className="text-sm text-[#F5F3EF]/50">{centerSubtext}</span>
          )}
        </div>
      )}
    </div>
  );
}
