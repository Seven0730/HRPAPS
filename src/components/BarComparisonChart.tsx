// src/components/BarComparisonChart.tsx
import React, { useMemo } from 'react';
import { useDashboard } from '../context/DashboardContext';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

/**
 * 城区平均对比柱状图：展示每个 Town 在当前筛选下的 GBT 与 XGB 平均预测
 */
const BarComparisonChart: React.FC = () => {
  const { filteredGbtData, filteredXgbData } = useDashboard();

  // 聚合计算各 town 的平均
  const data = useMemo(() => {
    const gbtMap: Record<string, { sum: number; count: number }> = {};
    filteredGbtData.forEach(item => {
      const t = item.town;
      if (!gbtMap[t]) gbtMap[t] = { sum: 0, count: 0 };
      gbtMap[t].sum += item.prediction;
      gbtMap[t].count += 1;
    });

    const xgbMap: Record<string, { sum: number; count: number }> = {};
    filteredXgbData.forEach(item => {
      const t = item.town;
      if (!xgbMap[t]) xgbMap[t] = { sum: 0, count: 0 };
      xgbMap[t].sum += item.resale_price;
      xgbMap[t].count += 1;
    });

    const towns = Array.from(new Set<string>([...Object.keys(gbtMap), ...Object.keys(xgbMap)])).sort();

    return towns.map(town => ({
      town,
      GBT: gbtMap[town] ? +(gbtMap[town].sum / gbtMap[town].count).toFixed(0) : 0,
      XGB: xgbMap[town] ? +(xgbMap[town].sum / xgbMap[town].count).toFixed(0) : 0,
    }));
  }, [filteredGbtData, filteredXgbData]);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="town" tick={{ fontSize: 12 }} />
        <YAxis />
        <Tooltip />
        <Legend />
        {/* 指定两种颜色，分别对应 GBT 和 XGB */}
        <Bar dataKey="GBT" name="GBT Average" barSize={20} fill="#8884d8" />
        <Bar dataKey="XGB" name="XGB Average" barSize={20} fill="#82ca9d" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default React.memo(BarComparisonChart);
