import React, { useMemo } from 'react';
import ReactEcharts from 'echarts-for-react';
import * as echarts from 'echarts/core';
import { TooltipComponent, GridComponent, VisualMapComponent } from 'echarts/components';
import { HeatmapChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';

import { useDashboard } from '../context/DashboardContext';

echarts.use([HeatmapChart, TooltipComponent, GridComponent, VisualMapComponent, CanvasRenderer]);

/**
 * 热力图：展示 Town × Month 的平均预测（GBT & XGB 可分开实现，或合并）
 */
const HeatmapChartComponent: React.FC = () => {
  const { filteredGbtData } = useDashboard();

  // 聚合：Town × Month 的 GBT 平均
  const gbtMap = useMemo(() => {
    const map: Record<string, Record<string, { sum: number; count: number }>> = {};
    filteredGbtData.forEach(item => {
      if (!map[item.town]) map[item.town] = {};
      const m = item.month;
      if (!map[item.town][m]) map[item.town][m] = { sum: 0, count: 0 };
      map[item.town][m].sum += item.prediction;
      map[item.town][m].count += 1;
    });
    return map;
  }, [filteredGbtData]);

  // 获取所有 unique towns 与 months
  const towns = useMemo(() => Object.keys(gbtMap).sort(), [gbtMap]);
  const months = useMemo(() => {
    const set = new Set<string>();
    filteredGbtData.forEach(item => set.add(item.month));
    return Array.from(set).sort();
  }, [filteredGbtData]);

  // 构建 heatmap 数据 [monthIndex, townIndex, value]
  const data = useMemo(() => {
    const arr: [number, number, number][] = [];
    towns.forEach((town, i) => {
      months.forEach((month, j) => {
        const cell = gbtMap[town]?.[month];
        const value = cell ? cell.sum / cell.count : 0;
        arr.push([j, i, +value.toFixed(0)]);
      });
    });
    return arr;
  }, [towns, months, gbtMap]);

  const option = useMemo(() => ({
    tooltip: {
      position: 'top',
      formatter: ([monthIdx, townIdx, value]: any) => {
        return `${months[monthIdx]}<br/>${towns[townIdx]}: ${value}`;
      }
    },
    grid: {
      height: '70%',
      top: '10%'
    },
    xAxis: {
      type: 'category',
      data: months,
      name: 'Month'
    },
    yAxis: {
      type: 'category',
      data: towns,
      name: 'Town'
    },
    visualMap: {
      min: 0,
      max: Math.max(...data.map(d => d[2])),
      calculable: true,
      orient: 'horizontal',
      left: 'center',
      bottom: '0%'
    },
    series: [
      {
        name: 'GBT预测',
        type: 'heatmap',
        data,
        label: {
          show: false
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  }), [data, months, towns]);

  return (
    <ReactEcharts
      option={option}
      style={{ width: '100%', height: '100%' }}
      notMerge
      lazyUpdate
    />
  );
};

export default HeatmapChartComponent;
