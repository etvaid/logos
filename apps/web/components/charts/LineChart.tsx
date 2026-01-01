'use client';

import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Area,
  AreaChart,
} from 'recharts';

interface LineChartProps {
  data: { name: string; [key: string]: number | string }[];
  lines: {
    dataKey: string;
    name: string;
    color: string;
    strokeWidth?: number;
    dashed?: boolean;
  }[];
  showGrid?: boolean;
  showLegend?: boolean;
  areaFill?: boolean;
  formatXAxis?: (value: string) => string;
  formatYAxis?: (value: number) => string;
}

export default function LineChart({
  data,
  lines,
  showGrid = true,
  showLegend = true,
  areaFill = false,
  formatXAxis,
  formatYAxis,
}: LineChartProps) {
  const defaultFormatY = (value: number) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
    return value.toString();
  };

  const ChartComponent = areaFill ? AreaChart : RechartsLineChart;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ChartComponent data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
        {showGrid && (
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(201, 169, 98, 0.1)" />
        )}
        <XAxis
          dataKey="name"
          tick={{ fill: '#F5F3EF', fontSize: 11 }}
          tickLine={false}
          axisLine={{ stroke: 'rgba(201, 169, 98, 0.2)' }}
          tickFormatter={formatXAxis}
        />
        <YAxis
          tick={{ fill: '#F5F3EF', fontSize: 11 }}
          tickLine={false}
          axisLine={{ stroke: 'rgba(201, 169, 98, 0.2)' }}
          tickFormatter={formatYAxis || defaultFormatY}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: '#1A1A1D',
            border: '1px solid rgba(201, 169, 98, 0.2)',
            borderRadius: '8px',
            color: '#F5F3EF',
          }}
          formatter={(value: number, name: string) => [value.toLocaleString(), name]}
        />
        {showLegend && (
          <Legend
            formatter={(value) => (
              <span className="text-[#F5F3EF]/70 text-sm">{value}</span>
            )}
          />
        )}
        {lines.map((line) =>
          areaFill ? (
            <Area
              key={line.dataKey}
              type="monotone"
              dataKey={line.dataKey}
              name={line.name}
              stroke={line.color}
              fill={line.color}
              fillOpacity={0.2}
              strokeWidth={line.strokeWidth || 2}
              strokeDasharray={line.dashed ? '5 5' : undefined}
              animationDuration={1000}
            />
          ) : (
            <Line
              key={line.dataKey}
              type="monotone"
              dataKey={line.dataKey}
              name={line.name}
              stroke={line.color}
              strokeWidth={line.strokeWidth || 2}
              strokeDasharray={line.dashed ? '5 5' : undefined}
              dot={false}
              activeDot={{ r: 6, fill: line.color }}
              animationDuration={1000}
            />
          )
        )}
      </ChartComponent>
    </ResponsiveContainer>
  );
}
