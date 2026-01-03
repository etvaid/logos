'use client';

import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

interface BarChartProps {
  data: { name: string; value: number; color?: string }[];
  horizontal?: boolean;
  showGrid?: boolean;
  barColor?: string;
  gradientColors?: boolean;
  maxBars?: number;
}

const GRADIENT_COLORS = [
  '#C9A962',
  '#B8994D',
  '#A78938',
  '#967923',
  '#85690E',
  '#74590F',
  '#634910',
  '#523911',
];

export default function BarChart({
  data,
  horizontal = false,
  showGrid = true,
  barColor = '#C9A962',
  gradientColors = false,
  maxBars = 20,
}: BarChartProps) {
  const displayData = data.slice(0, maxBars);

  const formatNumber = (value: number) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
    return value.toString();
  };

  if (horizontal) {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart
          data={displayData}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
        >
          {showGrid && (
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(201, 169, 98, 0.1)"
              horizontal={true}
              vertical={false}
            />
          )}
          <XAxis
            type="number"
            tick={{ fill: '#F5F3EF', fontSize: 11 }}
            tickLine={false}
            axisLine={{ stroke: 'rgba(201, 169, 98, 0.2)' }}
            tickFormatter={formatNumber}
          />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fill: '#F5F3EF', fontSize: 11 }}
            tickLine={false}
            axisLine={{ stroke: 'rgba(201, 169, 98, 0.2)' }}
            width={75}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1A1A1D',
              border: '1px solid rgba(201, 169, 98, 0.2)',
              borderRadius: '8px',
              color: '#F5F3EF',
            }}
            formatter={(value: number) => [value.toLocaleString(), 'Count']}
          />
          <Bar dataKey="value" radius={[0, 4, 4, 0]} animationDuration={1000}>
            {displayData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={
                  entry.color ||
                  (gradientColors
                    ? GRADIENT_COLORS[index % GRADIENT_COLORS.length]
                    : barColor)
                }
              />
            ))}
          </Bar>
        </RechartsBarChart>
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsBarChart
        data={displayData}
        margin={{ top: 5, right: 10, left: 10, bottom: 60 }}
      >
        {showGrid && (
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(201, 169, 98, 0.1)"
            vertical={false}
          />
        )}
        <XAxis
          dataKey="name"
          tick={{ fill: '#F5F3EF', fontSize: 10 }}
          tickLine={false}
          axisLine={{ stroke: 'rgba(201, 169, 98, 0.2)' }}
          interval={0}
          angle={-45}
          textAnchor="end"
          height={60}
        />
        <YAxis
          tick={{ fill: '#F5F3EF', fontSize: 11 }}
          tickLine={false}
          axisLine={{ stroke: 'rgba(201, 169, 98, 0.2)' }}
          tickFormatter={formatNumber}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: '#1A1A1D',
            border: '1px solid rgba(201, 169, 98, 0.2)',
            borderRadius: '8px',
            color: '#F5F3EF',
          }}
          formatter={(value: number) => [value.toLocaleString(), 'Count']}
        />
        <Bar dataKey="value" radius={[4, 4, 0, 0]} animationDuration={1000}>
          {displayData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={
                entry.color ||
                (gradientColors
                  ? GRADIENT_COLORS[index % GRADIENT_COLORS.length]
                  : barColor)
              }
            />
          ))}
        </Bar>
      </RechartsBarChart>
    </ResponsiveContainer>
  );
}
