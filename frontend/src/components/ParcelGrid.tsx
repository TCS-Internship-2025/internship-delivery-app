import { useState } from 'react';
import { AgGridReact } from 'ag-grid-react';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';

import type { ColDef, ICellRendererParams } from 'ag-grid-community';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';

import { getParcelChipData } from '@/utils/parcelChipData';

const StatusChipRenderer = (params: ICellRendererParams<ParcelData, string>) => {
  const chipData = getParcelChipData(params.value ?? '');

  return <Chip {...chipData} sx={{ alignSelf: 'center', py: 2.5, px: 1, fontSize: 20 }} />;
};

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
    cellRenderer: StatusChipRenderer,
    cellStyle: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
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
    <Box
      className="ag-theme-quartz"
      sx={{
        width: '70%',
        height: 800,
        margin: '40px auto',
        '--ag-row-height': '56px',
        '--ag-font-size': '24px',
        '--ag-grid-size': '10px',
      }}
    >
      <AgGridReact
        rowData={rowData}
        columnDefs={colDefs}
        defaultColDef={{
          resizable: true,
          sortable: true,
          filter: true,
          flex: 1,
        }}
        theme="legacy"
        pagination={true}
        paginationPageSize={10}
        paginationPageSizeSelector={[10, 20]}
      />
    </Box>
  );
};
