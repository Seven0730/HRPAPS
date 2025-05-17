// src/components/FilterPanel.tsx
import React, { useMemo, useEffect, useState } from 'react';
import { useDashboard } from '../context/DashboardContext';

const FilterPanel: React.FC = () => {
  const { filters, setFilters, gbtData, xgbData } = useDashboard();
  const [isDark, setIsDark] = useState<boolean>(false);

  // 检测深色模式
  useEffect(() => {
    const matcher = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = (e: MediaQueryListEvent) => setIsDark(e.matches);
    setIsDark(matcher.matches);
    matcher.addEventListener('change', onChange);
    return () => matcher.removeEventListener('change', onChange);
  }, []);

  const towns = useMemo(() => {
    const set = new Set<string>();
    gbtData.forEach(item => set.add(item.town));
    xgbData.forEach(item => set.add(item.town));
    return Array.from(set).sort();
  }, [gbtData, xgbData]);

  const flatTypes = useMemo(() => {
    const set = new Set<string>();
    gbtData.forEach(item => set.add(item.flat_type));
    return Array.from(set).sort();
  }, [gbtData]);

  const flatModels = useMemo(() => {
    const set = new Set<string>();
    gbtData.forEach(item => set.add(item.flat_model));
    return Array.from(set).sort();
  }, [gbtData]);

  const toggle = (value: string, list: string[], key: keyof typeof filters) => {
    const updated = list.includes(value)
      ? list.filter(v => v !== value)
      : [...list, value];
    setFilters({ ...filters, [key]: updated } as any);
  };

  const selectAll = (options: string[], key: keyof typeof filters) => {
    setFilters({ ...filters, [key]: options } as any);
  };

  const clearAll = (key: keyof typeof filters) => {
    setFilters({ ...filters, [key]: [] } as any);
  };

  // 动态样式
  const bgColor = isDark ? '#2a2a2a' : '#f5f5f5';
  const textColor = isDark ? '#e0e0e0' : '#000';
  const borderColor = isDark ? '#444' : '#ddd';
  const sectionBg = isDark ? '#333' : '#fff';

  const buttonStyle = {
    marginRight: 8,
    padding: '2px 6px',
    fontSize: 12,
    cursor: 'pointer' as const,
    background: isDark ? '#555' : '#e0e0e0',
    color: textColor,
    border: `1px solid ${borderColor}`,
    borderRadius: 4,
  };

  const labelStyle = { display: 'flex', alignItems: 'center' as const, padding: '2px 4px', width: '100%' };

  return (
    <div
      style={{
        background: bgColor,
        color: textColor,
        padding: 24,
        borderRadius: 8,
        boxShadow: isDark
          ? '0 2px 4px rgba(0,0,0,0.5)'
          : '0 2px 4px rgba(0,0,0,0.1)',
        border: `1px solid ${borderColor}`
      }}
    >
      <h2 style={{ marginBottom: 16 }}>Filters</h2>
      {/* Date Range */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
          <label style={{ fontWeight: 500, flex: '0 0 40px' }}>From:</label>
          <input
            type="month"
            value={filters.dateFrom}
            onChange={e => setFilters({ ...filters, dateFrom: e.target.value })}
            style={{ flex: 1, padding: 6, background: sectionBg, color: textColor, border: `1px solid ${borderColor}`, borderRadius: 4 }}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <label style={{ fontWeight: 500, flex: '0 0 40px' }}>To:</label>
          <input
            type="month"
            value={filters.dateTo}
            onChange={e => setFilters({ ...filters, dateTo: e.target.value })}
            style={{ flex: 1, padding: 6, background: sectionBg, color: textColor, border: `1px solid ${borderColor}`, borderRadius: 4 }}
          />
        </div>
      </div>
      {/* Towns */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <label style={{ fontWeight: 500 }}>Town</label>
          <div>
            <button style={buttonStyle} onClick={() => selectAll(towns, 'selectedTowns')}>SelectAll</button>
            <button style={buttonStyle} onClick={() => clearAll('selectedTowns')}>Clear</button>
          </div>
        </div>
        <div style={{ maxHeight: 120, overflowY: 'auto', border: `1px solid ${borderColor}`, borderRadius: 4, background: sectionBg }}> 
          {towns.map(t => (
            <label key={t} style={labelStyle}>
              <input
                type="checkbox"
                checked={filters.selectedTowns.includes(t)}
                onChange={() => toggle(t, filters.selectedTowns, 'selectedTowns')}
                style={{ marginRight: 8 }}
              />
              <span style={{ flex: 1 }}>{t}</span>
            </label>
          ))}
        </div>
      </div>
      {/* Flat Types */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <label style={{ fontWeight: 500 }}>Flat Type</label>
          <div>
            <button style={buttonStyle} onClick={() => selectAll(flatTypes, 'selectedFlatTypes')}>SelectAll</button>
            <button style={buttonStyle} onClick={() => clearAll('selectedFlatTypes')}>Clear</button>
          </div>
        </div>
        <div style={{ maxHeight: 80, overflowY: 'auto', border: `1px solid ${borderColor}`, borderRadius: 4, background: sectionBg }}>
          {flatTypes.map(ft => (
            <label key={ft} style={labelStyle}>
              <input
                type="checkbox"
                checked={filters.selectedFlatTypes.includes(ft)}
                onChange={() => toggle(ft, filters.selectedFlatTypes, 'selectedFlatTypes')}
                style={{ marginRight: 8 }}
              />
              <span style={{ flex: 1 }}>{ft}</span>
            </label>
          ))}
        </div>
      </div>
      {/* Flat Models */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <label style={{ fontWeight: 500 }}>Flat Model</label>
          <div>
            <button style={buttonStyle} onClick={() => selectAll(flatModels, 'selectedFlatModels')}>SelectAll</button>
            <button style={buttonStyle} onClick={() => clearAll('selectedFlatModels')}>Clear</button>
          </div>
        </div>
        <div style={{ maxHeight: 80, overflowY: 'auto', border: `1px solid ${borderColor}`, borderRadius: 4, background: sectionBg }}>
          {flatModels.map(fm => (
            <label key={fm} style={labelStyle}>
              <input
                type="checkbox"
                checked={filters.selectedFlatModels.includes(fm)}
                onChange={() => toggle(fm, filters.selectedFlatModels, 'selectedFlatModels')}
                style={{ marginRight: 8 }}
              />
              <span style={{ flex: 1 }}>{fm}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;