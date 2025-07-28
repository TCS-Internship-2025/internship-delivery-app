import { useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AgGridReact } from 'ag-grid-react';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';

import type { ColDef, ICellRendererParams, RowSelectionOptions } from 'ag-grid-community';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
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
  const [isRowSelected, setIsRowSelected] = useState(false);
  const gridRef = useRef<AgGridReact<ParcelData>>(null);
  const navigate = useNavigate();

  const rowSelection: RowSelectionOptions = useMemo(() => {
    return {
      mode: 'singleRow',
      checkboxes: false,
      enableClickSelection: true,
    };
  }, []);

  const handleDetails = () => {
    const selected = gridRef.current?.api.getSelectedRows();
    if (selected?.length) {
      console.log('Selected row:', selected[0]);
      void navigate(`details/${selected[0].parcelId}`);
    }
  };

  const handleSelection = () => {
    const selected = gridRef.current?.api.getSelectedRows() ?? [];
    setIsRowSelected(selected.length > 0);
  };

  return (
    <Box
      className="ag-theme-quartz"
      sx={{
        width: '75%',
        height: 800,
        margin: '20px auto 0',
        '--ag-row-height': '56px',
        '--ag-font-size': '22px',
        '--ag-grid-size': '10px',
      }}
    >
      <Button onClick={handleDetails} disabled={!isRowSelected} sx={{ fontSize: 16, my: 2 }}>
        See details
      </Button>
      <AgGridReact
        ref={gridRef}
        rowData={rowData}
        columnDefs={colDefs}
        defaultColDef={{
          resizable: true,
          sortable: true,
          filter: true,
          flex: 1,
        }}
        theme="legacy"
        rowSelection={rowSelection}
        onRowSelected={handleSelection}
        pagination={true}
        paginationPageSize={10}
        paginationPageSizeSelector={[10, 20]}
      />
    </Box>
  );
};
