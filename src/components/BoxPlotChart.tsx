// src/components/BoxPlotChart.tsx
import React, { useMemo } from 'react';
import ReactEcharts from 'echarts-for-react';
import * as echarts from 'echarts/core';
import 'echarts/extension/dataTool';
import { TooltipComponent, GridComponent, TitleComponent, ToolboxComponent } from 'echarts/components';
import { BoxplotChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';

import { useDashboard } from '../context/DashboardContext';

echarts.use([BoxplotChart, TooltipComponent, GridComponent, TitleComponent, ToolboxComponent, CanvasRenderer]);

/**
 * 按 Flat Type 展示 prediction 分布
 */
const BoxPlotChart: React.FC = () => {
  const { filteredGbtData } = useDashboard();

  const flatTypes = useMemo(() => {
    const set = new Set<string>();
    filteredGbtData.forEach(item => set.add(item.flat_type));
    return Array.from(set).sort();
  }, [filteredGbtData]);

  const rawData = useMemo(
    () => flatTypes.map(ft => filteredGbtData.filter(item => item.flat_type === ft).map(item => item.prediction)),
    [filteredGbtData, flatTypes]
  );

  const { boxData, outliers } = useMemo(() => {
    // @ts-ignore
    const result = echarts.dataTool.prepareBoxplotData(rawData);
    return {
      boxData: result.boxData,
      outliers: result.outliers,
    };
  }, [rawData]);

  const option = useMemo(() => ({
    tooltip: {
      trigger: 'item',
      axisPointer: { type: 'shadow' }
    },
    xAxis: {
      type: 'category',
      data: flatTypes,
      name: 'Flat Type',
      boundaryGap: true,
      splitArea: { show: false }
    },
    yAxis: {
      type: 'value',
      name: 'Prediction'
    },
    series: [
      {
        name: 'boxplot',
        type: 'boxplot',
        data: boxData,
        tooltip: {
          formatter: (param: any) => {
            return [
              `${param.name}`,
              `Max: ${param.data[5]}`,
              `Upper Quartile (Q3): ${param.data[4]}`,
              `Median: ${param.data[3]}`,
              `Lower Quartile (Q1): ${param.data[2]}`,
              `Min: ${param.data[1]}`
            ].join('<br/>');
          }
        }
      },
      {
        name: 'Outliers',
        type: 'scatter',
        data: outliers
      }
    ]
  }), [flatTypes, boxData, outliers]);

  return (
    <ReactEcharts
      option={option}
      style={{ width: '100%', height: '100%' }}
      notMerge={true}
      lazyUpdate={true}
    />
  );
};

export default BoxPlotChart;
