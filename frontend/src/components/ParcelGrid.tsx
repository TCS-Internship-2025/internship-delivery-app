import { useState } from 'react';
import { AgGridReact } from 'ag-grid-react';

import 'ag-grid-community/styles/ag-grid.css';

import { themeQuartz } from 'ag-grid-community';
import type { ColDef } from 'ag-grid-community';

import Box from '@mui/material/Box';

const myTheme = themeQuartz.withParams({
  spacing: 12,
  rowHeight: 10,
  fontSize: 20,
  backgroundColor: 'blue',
});

const colDefs: ColDef<ParcelData>[] = [
  {
    field: 'parcelId',
    headerName: 'Parcel ID',
    sortable: true,
    filter: true,
  },
  {
    field: 'address',
    headerName: 'Address',
    sortable: true,
    filter: true,
  },
  {
    field: 'delivery',
    headerName: 'Delivery Type',
    sortable: true,
    filter: true,
  },
  {
    field: 'payment',
    headerName: 'Payment',
    sortable: true,
    filter: true,
  },
  {
    field: 'status',
    headerName: 'Status',
    sortable: true,
    filter: true,
  },
];

interface ParcelData {
  parcelId?: number;
  address?: string;
  delivery?: string;
  payment?: string;
  status: string;
}

interface ParcelGridProps {
  parcels?: ParcelData[];
}

export const ParcelGrid = ({ parcels }: ParcelGridProps = {}) => {
  // if (!parcels) throw new Error();
  // TODO: Error handling

  const [rowData] = useState(parcels ?? undefined);

  return (
    <Box sx={{ width: '80%', height: '400px', margin: 'auto' }}>
      <AgGridReact
        rowData={rowData}
        columnDefs={colDefs}
        defaultColDef={{
          resizable: true,
          sortable: true,
          filter: true,
          flex: 1,
        }}
        theme={myTheme}
        //TODO: theme
      />
    </Box>
  );
};
