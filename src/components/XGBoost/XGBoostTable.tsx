import { useState, useEffect } from 'react';
import {
  DataGrid,
  GridColDef,
  GridPaginationModel,
  GridRenderCellParams,
} from '@mui/x-data-grid';
import { Box, CircularProgress } from '@mui/material';

interface ResaleRow {
  id: number;
  year_month: string;
  town: string;
  resale_price: number;
}

function XGBoostTable(){
  const [rows, setRows] = useState<ResaleRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 25,
  });

  useEffect(() => {
    fetch('/XGBoost.json')
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data: Omit<ResaleRow, 'id'>[]) => {
        const mapped = data.map((r, idx) => ({
          id: idx + 1,
          year_month: r.year_month,
          town: r.town,
          resale_price: r.resale_price,
        }));
        setRows(mapped);
      })
      .catch(err => {
        console.error('JSON load fail', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const columns: GridColDef<ResaleRow>[] = [
    {
      field: 'year_month',
      headerName: 'Year-Month',
      width: 120,
    },
    {
      field: 'town',
      headerName: 'Town',
      width: 140,
    },
    {
      field: 'resale_price',
      headerName: 'Resale Price',
      type: 'number',
      width: 150,
      renderCell: (params: GridRenderCellParams<ResaleRow, number>) => {
        const v = params.value;
        return v != null ? v.toFixed(2) : '';
      },
    },
  ];

  return (
    <Box sx={{ height: 'calc(100vh - 120px)', width: '100%', p: 2 }}>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <DataGrid<ResaleRow>
          rows={rows}
          columns={columns}
          loading={loading}
          pagination
          paginationModel={paginationModel}
          onPaginationModelChange={model => setPaginationModel(model)}
          pageSizeOptions={[10, 25, 50, 100]}
        />
      )}
    </Box>
  );
};

export default XGBoostTable;
