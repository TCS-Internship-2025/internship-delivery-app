import { useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AgGridReact } from 'ag-grid-react';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';

import type { ColDef, ICellRendererParams, RowSelectionOptions } from 'ag-grid-community';

import { useSmallScreen } from '@/hooks/useSmallScreen';
import { useTheme } from '@/providers/ThemeProvider';

import type { ParcelListData } from '@/apis/parcelGet';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';

import { getParcelChipData } from '@/utils/parcelChipData';
import { deliveryConverter, paymentConverter } from '@/utils/parcelTypeConverter';

const StatusChipRenderer = (params: ICellRendererParams<ParcelShortData, string>) => {
  const isSmallScreen = useSmallScreen();
  const chipData = getParcelChipData(params.value ?? '');

  return (
    <Chip
      {...chipData}
      sx={
        isSmallScreen
          ? { alignSelf: 'center', py: 1, px: 0.5, fontSize: 12 }
          : { alignSelf: 'center', py: 2.5, px: 1, fontSize: 20 }
      }
    />
  );
};

const colDefs: ColDef<ParcelShortData>[] = [
  {
    field: 'code',
    headerName: 'Code',
    sortable: true,
    filter: true,
  },
  {
    field: 'recipient',
    headerName: 'Recipient',
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
    headerName: 'Delivery',
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

interface ParcelShortData {
  parcelId?: string;
  code?: string;
  recipient?: string;
  address?: string;
  delivery?: string;
  payment?: string;
  status: string;
}

export const ParcelGrid = ({ parcels }: { parcels?: ParcelListData }) => {
  // TODO: Error handling

  const shortParcels: ParcelShortData[] =
    parcels?.map((parcel) => ({
      parcelId: parcel.id,
      address: parcel.recipient.address.line1,
      code: parcel.trackingCode,
      recipient: parcel.recipient.name,
      delivery: deliveryConverter(parcel.deliveryType),
      payment: paymentConverter(parcel.paymentType),
      status: parcel.currentStatus,
    })) ?? [];

  const [rowData] = useState(shortParcels ?? undefined);
  const gridRef = useRef<AgGridReact<ParcelShortData>>(null);
  const isSmallScreen = useSmallScreen();
  const { mode } = useTheme();
  const navigate = useNavigate();

  const rowSelection: RowSelectionOptions = useMemo(() => {
    return {
      mode: 'singleRow',
      checkboxes: false,
      enableClickSelection: true,
    };
  }, []);

  const handleSelection = () => {
    const selected = gridRef.current?.api.getSelectedRows();
    if (selected?.length) {
      console.log('Selected row:', selected[0]);
      void navigate(`details/${selected[0].parcelId}`);
    }
  };

  return (
    <Box
      className={`ag-theme-quartz${mode === 'dark' ? '-dark' : ''}`}
      width={{ xs: '100%', md: '75%' }}
      height={parcels?.length ? { xs: parcels.length * 43.5, md: parcels.length * 60.5 } : { xs: 360, md: 692 }}
      ml="auto"
      mr="auto"
      sx={
        isSmallScreen
          ? {
              '--ag-row-height': '40px',
              '--ag-font-size': '16px',
              '--ag-grid-size': '8px',
              ...(mode === 'dark' && {
                '--ag-background-color': '#353b39',
                '--ag-header-background-color': '#2e3331',
                '--ag-row-hover-color': '#38423f',
                '--ag-selected-row-background-color': '#43514c',
              }),
            }
          : {
              '--ag-row-height': '56px',
              '--ag-font-size': '22px',
              '--ag-grid-size': '10px',
              ...(mode === 'dark' && {
                '--ag-background-color': '#353b39',
                '--ag-header-background-color': '#2e3331',
                '--ag-row-hover-color': '#38423f',
                '--ag-selected-row-background-color': '#43514c',
              }),
            }
      }
    >
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
      />
    </Box>
  );
};
