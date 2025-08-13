import { useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AgGridReact } from 'ag-grid-react';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';

import { ROUTES } from '@/constants';
import type { ICellRendererParams, RowSelectionOptions } from 'ag-grid-community';

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
          ? {
              alignSelf: 'center',
              py: 1.5,
              px: 1,
              fontSize: 12,
              fontWeight: 600,
              borderRadius: 2,
            }
          : {
              alignSelf: 'center',
              py: 2.5,
              px: 2,
              fontSize: 14,
              fontWeight: 600,
              borderRadius: 2,
            }
      }
    />
  );
};

const PARCEL_COLUMNS = {
  CODE: {
    field: 'code',
    headerName: 'Code',
    sortable: true,
    filter: true,
  },
  RECIPIENT: {
    field: 'recipient',
    headerName: 'Recipient',
    sortable: true,
    filter: true,
  },
  ADDRESS: {
    field: 'address',
    headerName: 'Address',
    sortable: true,
    filter: true,
  },
  DELIVERY: {
    field: 'delivery',
    headerName: 'Delivery',
    sortable: true,
    filter: true,
  },
  PAYMENT: {
    field: 'payment',
    headerName: 'Payment',
    sortable: true,
    filter: true,
  },
  STATUS: {
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
};

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
  const shortParcels: ParcelShortData[] =
    parcels?.map((parcel) => ({
      parcelId: parcel.id,
      address: parcel.address.line1,
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

  const colDefs = isSmallScreen
    ? [PARCEL_COLUMNS.CODE, PARCEL_COLUMNS.RECIPIENT, PARCEL_COLUMNS.ADDRESS]
    : [
        PARCEL_COLUMNS.CODE,
        PARCEL_COLUMNS.RECIPIENT,
        PARCEL_COLUMNS.ADDRESS,
        PARCEL_COLUMNS.DELIVERY,
        PARCEL_COLUMNS.PAYMENT,
        PARCEL_COLUMNS.STATUS,
      ];

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
      void navigate(`${ROUTES.DETAILS}?parcelId=${selected[0].parcelId}`);
    }
  };
  return (
    <Box
      className={`ag-theme-quartz${mode === 'dark' ? '-dark' : ''}`}
      width={isSmallScreen ? '95%' : '90%'}
      height={isSmallScreen ? 520 : 620}
      mt={isSmallScreen ? 3 : 6}
      ml="auto"
      mr="auto"
      sx={{
        borderRadius: 3,
        overflow: 'hidden',
        boxShadow: mode === 'dark' ? '0 8px 32px rgba(0, 0, 0, 0.4)' : '0 4px 20px rgba(0, 0, 0, 0.08)',
        border: mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.08)',
        ...(isSmallScreen
          ? {
              '--ag-row-height': '48px',
              '--ag-font-size': '14px',
              '--ag-grid-size': '8px',
              '--ag-header-height': '44px',
              '--ag-font-family': '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
              ...(mode === 'dark' && {
                '--ag-background-color': '#1e2522',
                '--ag-header-background-color': '#2a312d',
                '--ag-row-hover-color': '#364039',
                '--ag-selected-row-background-color': '#3d4b44',
                '--ag-border-color': '#404940',
                '--ag-header-foreground-color': '#e8f4f8',
              }),
              ...(mode === 'light' && {
                '--ag-background-color': '#ffffff',
                '--ag-header-background-color': '#f8fafc',
                '--ag-row-hover-color': '#f1f5f9',
                '--ag-selected-row-background-color': '#e2e8f0',
                '--ag-border-color': '#e2e8f0',
                '--ag-header-foreground-color': '#334155',
              }),
            }
          : {
              '--ag-row-height': '60px',
              '--ag-font-size': '16px',
              '--ag-grid-size': '12px',
              '--ag-header-height': '56px',
              '--ag-font-family': '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
              ...(mode === 'dark' && {
                '--ag-background-color': '#1e2522',
                '--ag-header-background-color': '#2a312d',
                '--ag-row-hover-color': '#364039',
                '--ag-selected-row-background-color': '#3d4b44',
                '--ag-border-color': '#404940',
                '--ag-header-foreground-color': '#e8f4f8',
              }),
              ...(mode === 'light' && {
                '--ag-background-color': '#ffffff',
                '--ag-header-background-color': '#f8fafc',
                '--ag-row-hover-color': '#f1f5f9',
                '--ag-selected-row-background-color': '#e2e8f0',
                '--ag-border-color': '#e2e8f0',
                '--ag-header-foreground-color': '#334155',
              }),
            }),
      }}
    >
      <AgGridReact
        ref={gridRef}
        rowData={[...rowData].reverse()}
        columnDefs={colDefs}
        defaultColDef={{
          resizable: true,
          sortable: true,
          filter: true,
          flex: 1,
          headerClass: 'custom-header',
          cellStyle: {
            display: 'flex',
            alignItems: 'center',
            fontWeight: 500,
          },
        }}
        theme="legacy"
        rowSelection={rowSelection}
        onRowSelected={handleSelection}
        headerHeight={isSmallScreen ? 44 : 56}
        rowHeight={isSmallScreen ? 48 : 60}
      />
    </Box>
  );
};
