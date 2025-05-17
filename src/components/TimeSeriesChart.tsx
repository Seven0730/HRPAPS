import React, { useMemo } from 'react';
import { useDashboard } from '../context/DashboardContext';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

/**
 * 时间序列折线图：展示两种模型的月度平均预测对比
 */
const TimeSeriesChart: React.FC = () => {
  const { filteredGbtData, filteredXgbData } = useDashboard();

  // 计算月度平均
  const data = useMemo(() => {
    const mapGbt: Record<string, { sum: number; count: number }> = {};
    filteredGbtData.forEach(item => {
      const m = item.month;
      if (!mapGbt[m]) mapGbt[m] = { sum: 0, count: 0 };
      mapGbt[m].sum += item.prediction;
      mapGbt[m].count += 1;
    });

    const mapXgb: Record<string, { sum: number; count: number }> = {};
    filteredXgbData.forEach(item => {
      const m = item.year_month;
      if (!mapXgb[m]) mapXgb[m] = { sum: 0, count: 0 };
      mapXgb[m].sum += item.resale_price;
      mapXgb[m].count += 1;
    });

    // 合并所有月份，并排序
    const months = Array.from(
      new Set([...Object.keys(mapGbt), ...Object.keys(mapXgb)])
    ).sort();

    return months.map(month => ({
      month,
      GBT: mapGbt[month] ? +(mapGbt[month].sum / mapGbt[month].count).toFixed(0) : null,
      XGB: mapXgb[month] ? +(mapXgb[month].sum / mapXgb[month].count).toFixed(0) : null,
    }));
  }, [filteredGbtData, filteredXgbData]);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="GBT"
          name="GBT Monthly Average"
          stroke="#8884d8"
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="XGB"
          name="XGB Monthly Average"
          stroke="#82ca9d"
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default TimeSeriesChart;
