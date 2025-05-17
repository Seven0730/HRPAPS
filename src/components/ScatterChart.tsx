import React, { useMemo } from 'react';
import { useDashboard } from '../context/DashboardContext';
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
} from 'recharts';

const COLORS = [
  '#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#d0ed57', '#a4de6c',
  '#8dd1e1', '#83a6ed', '#8884d8', '#8dd1e1',
];

/**
 * 散点图：Floor Area vs Prediction，按 Flat Type 分组
 */
const ScatterChartComponent: React.FC = () => {
  const { filteredGbtData } = useDashboard();

  // 按 flat_type 分组
  const groups = useMemo(() => {
    const map: Record<string, any[]> = {};
    filteredGbtData.forEach(item => {
      if (!map[item.flat_type]) map[item.flat_type] = [];
      map[item.flat_type].push({
        x: item.floor_area_sqm,
        y: item.prediction,
      });
    });
    return Object.entries(map).map(([key, data], index) => ({
      flatType: key,
      data,
      color: COLORS[index % COLORS.length],
    }));
  }, [filteredGbtData]);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
        <CartesianGrid />
        <XAxis 
          type="number"
          dataKey="x"
          name="Floor Area"
          unit="sqm"
          label={{ value: 'Floor Area (sqm)', position: 'insideBottom', offset: -10 }}
        />
        <YAxis
          type="number"
          dataKey="y"
          name="Prediction"
          unit="$"
          label={{ value: 'Prediction Price', angle: -90, position: 'insideLeft' }}
        />
        <Tooltip cursor={{ strokeDasharray: '3 3' }} />
        <Legend />
        {groups.map((grp, idx) => (
          <Scatter
            key={grp.flatType}
            name={grp.flatType}
            data={grp.data}
            fill={grp.color}
          >
            {grp.data.map((entry, i) => (
              <Cell key={`cell-${i}`} fill={grp.color} />
            ))}
          </Scatter>
        ))}
      </ScatterChart>
    </ResponsiveContainer>
  );
};

export default ScatterChartComponent;
