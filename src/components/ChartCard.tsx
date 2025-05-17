// src/components/ChartCard.tsx
import React, { CSSProperties } from 'react';

interface ChartCardProps {
  title?: string;
  width?: number | string;
  height?: number | string;
  children: React.ReactNode;
}

/**
 * ChartCard 容器组件
 * - width: 由父级布局控制时可不传，自动填充容器；
 * - height: 可传入具体值，否则应用最小高度。
 */
const ChartCard: React.FC<ChartCardProps> = ({ title, width, height = '350px', children }) => {
  const containerStyle: CSSProperties = {
    minHeight: height,
    background: '#fff',
    border: '1px solid #e0e0e0',
    borderRadius: 8,
    padding: 16,
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    display: 'flex',
    flexDirection: 'column',
  };
  // 仅当传入 width 时设置，未传入则让父容器控制宽度
  if (width !== undefined) {
    (containerStyle as any).width = typeof width === 'number' ? `${width}px` : width;
  }

  return (
    <div style={containerStyle}>
      {title && <h3 style={{ marginBottom: 12, fontSize: '1.1rem' }}>{title}</h3>}
      <div style={{ flex: 1 }}>
        {children}
      </div>
    </div>
  );
};

export default React.memo(ChartCard);
