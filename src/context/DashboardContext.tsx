// src/context/DashboardContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { GbtRecord, XgbRecord } from '../types';

// 筛选条件类型
export interface Filters {
  dateFrom: string;            // "YYYY-MM"
  dateTo: string;              // "YYYY-MM"
  selectedTowns: string[];     // 区域筛选
  selectedFlatTypes: string[]; // 户型筛选
  selectedFlatModels: string[];// 房型筛选
}

interface DashboardContextValue {
  // 原始数据
  gbtData: GbtRecord[];
  xgbData: XgbRecord[];

  // 筛选条件与设置函数
  filters: Filters;
  setFilters: (f: Filters) => void;

  // 筛选后的数据
  filteredGbtData: GbtRecord[];
  filteredXgbData: XgbRecord[];

  loading: boolean;
  error?: string;
}

const DashboardContext = createContext<DashboardContextValue>({
  gbtData: [],
  xgbData: [],
  filters: { dateFrom: '', dateTo: '', selectedTowns: [], selectedFlatTypes: [], selectedFlatModels: [] },
  setFilters: () => {},
  filteredGbtData: [],
  filteredXgbData: [],
  loading: true,
});

export const DashboardProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [gbtData, setGbtData] = useState<GbtRecord[]>([]);
  const [xgbData, setXgbData] = useState<XgbRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();

  // 筛选状态
  const [filters, setFilters] = useState<Filters>({
    dateFrom: '',
    dateTo: '',
    selectedTowns: [],
    selectedFlatTypes: [],
    selectedFlatModels: [],
  });

  useEffect(() => {
    async function load() {
      try {
        // 加载 GBT.json
        const res1 = await fetch('/GBT.json');
        if (!res1.ok) throw new Error(`加载 GBT.json 失败：${res1.status}`);
        const gbt: GbtRecord[] = await res1.json();

        // 加载 XGXGBoost.json
        const res2 = await fetch('/XGBoost.json');
        if (!res2.ok) throw new Error(`加载 XGBoost.json 失败：${res2.status}`);
        const xgb: XgbRecord[] = await res2.json();

        setGbtData(gbt);
        setXgbData(xgb);
      } catch (e: any) {
        console.error(e);
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // 计算筛选后的 GBT 数据
  const filteredGbtData = useMemo(() => {
    return gbtData.filter(item => {
      // 日期过滤
      if (filters.dateFrom && item.month < filters.dateFrom) return false;
      if (filters.dateTo && item.month > filters.dateTo) return false;
      // 区域过滤
      if (filters.selectedTowns.length && !filters.selectedTowns.includes(item.town)) return false;
      // 户型过滤
      if (filters.selectedFlatTypes.length && !filters.selectedFlatTypes.includes(item.flat_type)) return false;
      // 房型过滤
      if (filters.selectedFlatModels.length && !filters.selectedFlatModels.includes(item.flat_model)) return false;
      return true;
    });
  }, [gbtData, filters]);

  // 计算筛选后的 XGB 数据（按 year_month 处理）
  const filteredXgbData = useMemo(() => {
    return xgbData.filter(item => {
      // 日期过滤
      if (filters.dateFrom && item.year_month < filters.dateFrom) return false;
      if (filters.dateTo && item.year_month > filters.dateTo) return false;
      // 区域过滤
      if (filters.selectedTowns.length && !filters.selectedTowns.includes(item.town)) return false;
      return true;
    });
  }, [xgbData, filters]);

  return (
    <DashboardContext.Provider
      value={{
        gbtData,
        xgbData,
        filters,
        setFilters,
        filteredGbtData,
        filteredXgbData,
        loading,
        error,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => useContext(DashboardContext);
