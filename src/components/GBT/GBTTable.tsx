import React, { useState, useEffect, useMemo } from 'react';
import { DataGrid, GridColDef, GridPaginationModel } from '@mui/x-data-grid';
import { Box, TextField, CircularProgress } from '@mui/material';
import { PredictionRow } from '../../types';

function GBTTable(){
  const [data, setData] = useState<PredictionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 25,
  });

  useEffect(() => {
    fetch('/GBT.json')
      .then(res => res.text())
      .then(text => {
        const lines = text.trim().split('\n').filter(line => line.trim() !== '');
        const rows: PredictionRow[] = lines.map((line, idx) => {
          const obj = JSON.parse(line);
          return { id: idx + 1, ...obj };
        });
        setData(rows);
      })
      .catch(err => {
        console.error('解析 JSONL 失败', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const filteredRows = useMemo(() => {
    if (!searchText) return data;
    const lower = searchText.toLowerCase();
    return data.filter(row =>
      Object.values(row).some(v =>
        String(v).toLowerCase().includes(lower)
      )
    );
  }, [data, searchText]);

  const columns: GridColDef<PredictionRow>[] = [
    { field: 'month', headerName: 'Month', width: 100 },
    { field: 'town', headerName: 'Town', width: 140 },
    { field: 'flat_type', headerName: 'Flat Type', width: 110 },
    { field: 'flat_model', headerName: 'Flat Model', width: 130 },
    { field: 'floor_area_sqm', headerName: 'Area (sqm)', type: 'number', width: 110 },
    { field: 'storey_median', headerName: 'Storey Median', type: 'number', width: 130 },
    { field: 'flat_age', headerName: 'Flat Age', type: 'number', width: 100 },
    {
      field: 'prediction',
      headerName: 'Prediction',
      type: 'number',
      width: 150,
      valueFormatter: (value) => (value as number).toFixed(2),
    },
  ];

  return (
    <Box sx={{ height: 'calc(100vh - 120px)', width: '100%', p: 2 }}>
      <Box sx={{ mb: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
        <TextField
          label="Search"
          variant="outlined"
          size="small"
          value={searchText}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setSearchText(e.target.value);
          }}
        />
        {loading && <CircularProgress size={24} />}
      </Box>
      <DataGrid<PredictionRow>
        rows={filteredRows}
        columns={columns}
        loading={loading}
        pagination
        paginationModel={paginationModel}
        onPaginationModelChange={model => setPaginationModel(model)}
        pageSizeOptions={[10, 25, 50, 100]}
      />
    </Box>
  );
};

export default GBTTable;
