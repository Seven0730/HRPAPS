// src/components/ChartGrid.tsx
import React from 'react';

interface ChartGridProps {
  children: React.ReactNode;
}

/**
 * 用于布局多个 ChartCard
 */
const ChartGrid: React.FC<ChartGridProps> = ({ children }) => {
  return (
    <div
      style={{
        display: 'grid',
        gap: '16px',
      }}
    >
      {children}
    </div>
  );
};

export default ChartGrid;
