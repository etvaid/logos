'use client';

import {
  Radar,
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';

interface RadarChartProps {
  data: { subject: string; value: number; fullMark?: number }[];
  dataKey?: string;
  name?: string;
  color?: string;
  showLegend?: boolean;
  compareData?: { subject: string; value: number }[];
  compareName?: string;
  compareColor?: string;
}

export default function RadarChart({
  data,
  dataKey = 'value',
  name = 'Score',
  color = '#C9A962',
  showLegend = false,
  compareData,
  compareName = 'Comparison',
  compareColor = '#87CEEB',
}: RadarChartProps) {
  // Merge data if comparison exists
  const mergedData = data.map((item) => {
    const compareItem = compareData?.find((c) => c.subject === item.subject);
    return {
      ...item,
      compare: compareItem?.value || 0,
    };
  });

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsRadarChart cx="50%" cy="50%" outerRadius="80%" data={mergedData}>
        <PolarGrid stroke="rgba(201, 169, 98, 0.2)" />
        <PolarAngleAxis
          dataKey="subject"
          tick={{ fill: '#F5F3EF', fontSize: 12 }}
          tickLine={false}
        />
        <PolarRadiusAxis
          angle={30}
          domain={[0, 100]}
          tick={{ fill: '#F5F3EF', fontSize: 10 }}
          tickCount={5}
          stroke="rgba(201, 169, 98, 0.2)"
        />
        <Radar
          name={name}
          dataKey={dataKey}
          stroke={color}
          fill={color}
          fillOpacity={0.3}
          animationBegin={0}
          animationDuration={1000}
        />
        {compareData && (
          <Radar
            name={compareName}
            dataKey="compare"
            stroke={compareColor}
            fill={compareColor}
            fillOpacity={0.2}
            animationBegin={200}
            animationDuration={1000}
          />
        )}
        <Tooltip
          contentStyle={{
            backgroundColor: '#1A1A1D',
            border: '1px solid rgba(201, 169, 98, 0.2)',
            borderRadius: '8px',
            color: '#F5F3EF',
          }}
        />
        {showLegend && <Legend />}
      </RechartsRadarChart>
    </ResponsiveContainer>
  );
}
