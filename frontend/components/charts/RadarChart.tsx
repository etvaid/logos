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

// Single-series format (original)
interface SingleSeriesRadarChartProps {
  data: { subject: string; value: number; fullMark?: number }[];
  dataKey?: string;
  name?: string;
  color?: string;
  showLegend?: boolean;
  compareData?: { subject: string; value: number }[];
  compareName?: string;
  compareColor?: string;
  categories?: never;
  colors?: never;
}

// Multi-series format (for comparing multiple items across same categories)
interface MultiSeriesRadarChartProps {
  data: Record<string, string | number>[];
  categories: string[];
  colors?: string[];
  showLegend?: boolean;
  dataKey?: never;
  name?: never;
  color?: never;
  compareData?: never;
  compareName?: never;
  compareColor?: never;
}

type RadarChartProps = SingleSeriesRadarChartProps | MultiSeriesRadarChartProps;

function isMultiSeries(props: RadarChartProps): props is MultiSeriesRadarChartProps {
  return 'categories' in props && Array.isArray(props.categories);
}

export default function RadarChart(props: RadarChartProps) {
  const { showLegend = false } = props;

  // Multi-series mode
  if (isMultiSeries(props)) {
    const { data, categories, colors = ['#C9A962', '#4ECDC4', '#FF6B6B', '#DDA0DD'] } = props;

    // Transform data: each item becomes a series, categories become the axes
    // Input: [{ name: 'Plato', 'Sentence Length': 85, 'Vocabulary': 80, ... }, ...]
    // Output: [{ subject: 'Sentence Length', Plato: 85, Aristotle: 90, ... }, ...]
    const seriesNames = data.map(d => d.name as string);
    const transformedData = categories.map(category => {
      const point: Record<string, string | number> = { subject: category };
      data.forEach(series => {
        point[series.name as string] = series[category] as number;
      });
      return point;
    });

    return (
      <ResponsiveContainer width="100%" height="100%">
        <RechartsRadarChart cx="50%" cy="50%" outerRadius="80%" data={transformedData}>
          <PolarGrid stroke="rgba(201, 169, 98, 0.2)" />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fill: '#F5F3EF', fontSize: 10 }}
            tickLine={false}
          />
          <PolarRadiusAxis
            angle={30}
            domain={[0, 100]}
            tick={{ fill: '#F5F3EF', fontSize: 10 }}
            tickCount={5}
            stroke="rgba(201, 169, 98, 0.2)"
          />
          {seriesNames.map((name, i) => (
            <Radar
              key={name}
              name={name}
              dataKey={name}
              stroke={colors[i % colors.length]}
              fill={colors[i % colors.length]}
              fillOpacity={0.2}
              animationBegin={i * 100}
              animationDuration={1000}
            />
          ))}
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

  // Single-series mode (original behavior)
  const {
    data,
    dataKey = 'value',
    name = 'Score',
    color = '#C9A962',
    compareData,
    compareName = 'Comparison',
    compareColor = '#87CEEB',
  } = props as SingleSeriesRadarChartProps;

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
