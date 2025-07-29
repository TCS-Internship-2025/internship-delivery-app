import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MenuIcon from '@mui/icons-material/Menu';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';

export default function DrawerComponent({
  children,
  handleDrawerClick,
  open,
}: {
  children: React.ReactNode;
  handleDrawerClick: () => void;
  open: boolean;
}) {
  return (
    <>
      <Toolbar>
        <IconButton color="inherit" aria-label="open drawer" onClick={handleDrawerClick} edge="start" sx={{ mr: 2 }}>
          {open ? <ArrowBackIcon /> : <MenuIcon />}
        </IconButton>
      </Toolbar>
      <Drawer
        anchor="top"
        open={open}
        sx={{
          '& .MuiDrawer-paper': {
            height: 'auto',
            width: '100%',
            boxSizing: 'border-box',
            top: 64,
          },
        }}
        variant="persistent"
      >
        {children}
      </Drawer>
    </>
  );
}
