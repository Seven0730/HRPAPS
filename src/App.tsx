// src/App.tsx
import React, { useState } from 'react';
import { CssBaseline, Container, Typography, Button, Box } from '@mui/material';
import DataTable from './components/DataTable';  // 你原来的 JSONL/JSON 表格
import CSVTable from './components/CSVTable';  // 上面这个从 JSON 加载的表格

const App: React.FC = () => {
  const [showJsonTable, setShowJsonTable] = useState(false);

  return (
    <>
      <CssBaseline />
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="h4" sx={{ flexGrow: 1 }}>
            {showJsonTable ? 'Release Price 表格' : '预测结果表格'}
          </Typography>
          <Button
            variant="contained"
            onClick={() => setShowJsonTable(prev => !prev)}
          >
            切换到 {showJsonTable ? '预测结果' : 'Release Price'} 表格
          </Button>
        </Box>
        {showJsonTable ? <CSVTable /> : <DataTable />}
      </Container>
    </>
  );
};

export default App;
