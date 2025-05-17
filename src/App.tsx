import { useDashboard } from './context/DashboardContext';
import FilterPanel from './components/FilterPanel';
import ChartGrid from './components/ChartGrid';
import ChartCard from './components/ChartCard';
import TimeSeriesChart from './components/TimeSeriesChart';
import BarComparisonChart from './components/BarComparisonChart';
import ScatterChart from './components/ScatterChart';
import BoxPlotChart from './components/BoxPlotChart';
import HeatmapChart from './components/HeatmapChart';

function App() {
  const { loading, error } = useDashboard();

  if (loading) return <div style={{ padding: 20 }}>loading...</div>;
  if (error) return <div style={{ padding: 20, color: 'red' }}>error: {error}</div>;

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <aside style={{ flex: '0 0 auto', borderRight: '1px solid #eee', overflowY: 'auto' }}>
        <FilterPanel />
      </aside>

      <main style={{ flex: 1, padding: 16, overflowY: 'auto' }}>
        <h1 style={{ marginBottom: 16 }}>Dashboard</h1>
        <ChartGrid>
        <ChartCard title="Monthly Average Price Comparison" width={1100} height={500}>
            <TimeSeriesChart />
          </ChartCard>

          <ChartCard title="Town-wise Average Price Comparison" height={500}>
            <BarComparisonChart />
          </ChartCard>

          <ChartCard title="Floor Area vs Prediction (Scatter)" height={500}>
            <ScatterChart />
          </ChartCard>

          <ChartCard title="Flat Type Price Distribution (Boxplot)" height={500}>
            <BoxPlotChart />
          </ChartCard>

          <ChartCard title="Town-Month Heatmap" height={500}>
            <HeatmapChart />
          </ChartCard>
        </ChartGrid>
      </main>
    </div>
  );
}

export default App;
