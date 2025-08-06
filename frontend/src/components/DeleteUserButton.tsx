import { useState } from 'react';

import { useDeleteUser } from '@/apis/authApi';

import Delete from '@mui/icons-material/Delete';
import Warning from '@mui/icons-material/Warning';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

interface DeleteUserButtonProps {
  showDangerZone?: boolean;
  buttonVariant?: 'contained' | 'outlined' | 'text';
  buttonColor?: 'error' | 'primary' | 'secondary';
  buttonSize?: 'small' | 'medium' | 'large';
}

export default function DeleteUserButton({
  showDangerZone = true,
  buttonVariant = 'contained',
  buttonColor = 'error',
  buttonSize = 'medium',
}: DeleteUserButtonProps) {
  const [open, setOpen] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const deleteUserMutation = useDeleteUser();

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setConfirmText('');
  };

  const handleConfirmDelete = () => {
    if (confirmText === 'DELETE') {
      deleteUserMutation.mutate();
    }
  };

  const DeleteButton = (
    <Button
      variant={buttonVariant}
      color={buttonColor}
      size={buttonSize}
      startIcon={<Delete />}
      onClick={handleOpen}
      type="button"
    >
      Delete Account
    </Button>
  );

  if (showDangerZone) {
    return (
      <>
        <Box
          sx={{
            mt: 3,
            p: 2,
            border: '1px solid',
            borderColor: 'error.main',
            borderRadius: 2,
            bgcolor: 'error.light',
            opacity: 0.1,
          }}
        >
          <Box sx={{ opacity: 10 }}>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
              <Warning color="error" />
              <Typography variant="h6" color="error.main">
                Danger Zone
              </Typography>
            </Stack>
            <Typography variant="body2" color="error.dark" sx={{ mb: 2 }}>
              Once you delete your account, there is no going back. Please be certain.
            </Typography>
            {DeleteButton}
          </Box>
        </Box>

        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
          <DialogTitle>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Warning color="error" />
              <Typography variant="h6">Delete Account Permanently</Typography>
            </Stack>
          </DialogTitle>

          <DialogContent>
            <Alert severity="error" sx={{ mb: 2 }}>
              This action cannot be undone. This will permanently:
            </Alert>

            <Box component="ul" sx={{ pl: 2, mb: 3 }}>
              <Typography component="li" variant="body2">
                Delete your account and all associated data
              </Typography>
              <Typography component="li" variant="body2">
                Remove your profile information
              </Typography>
              <Typography component="li" variant="body2">
                Log you out of all devices
              </Typography>
            </Box>

            <TextField
              fullWidth
              label="Type DELETE to confirm"
              placeholder="DELETE"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              disabled={deleteUserMutation.isPending}
              helperText="Type DELETE in capital letters to confirm deletion"
              error={confirmText.length > 0 && confirmText !== 'DELETE'}
            />
          </DialogContent>

          <DialogActions>
            <Button onClick={handleClose} disabled={deleteUserMutation.isPending} type="button">
              Cancel
            </Button>
            <Button
              onClick={handleConfirmDelete}
              disabled={confirmText !== 'DELETE' || deleteUserMutation.isPending}
              variant="contained"
              color="error"
              startIcon={deleteUserMutation.isPending ? <CircularProgress size={16} /> : <Delete />}
              type="button"
            >
              {deleteUserMutation.isPending ? 'Deleting...' : 'Delete My Account'}
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }

  return (
    <>
      {DeleteButton}

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Warning color="error" />
            <Typography variant="h6">Delete Account Permanently</Typography>
          </Stack>
        </DialogTitle>

        <DialogContent>
          <Alert severity="error" sx={{ mb: 2 }}>
            This action cannot be undone. This will permanently:
          </Alert>

          <Box component="ul" sx={{ pl: 2, mb: 3 }}>
            <Typography component="li" variant="body2">
              Delete your account and all associated data
            </Typography>
            <Typography component="li" variant="body2">
              Remove your profile information
            </Typography>
            <Typography component="li" variant="body2">
              Log you out of all devices
            </Typography>
          </Box>

          <TextField
            fullWidth
            label="Type DELETE to confirm"
            placeholder="DELETE"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            disabled={deleteUserMutation.isPending}
            helperText="Type DELETE in capital letters to confirm deletion"
            error={confirmText.length > 0 && confirmText !== 'DELETE'}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} disabled={deleteUserMutation.isPending} type="button">
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            disabled={confirmText !== 'DELETE' || deleteUserMutation.isPending}
            variant="contained"
            color="error"
            startIcon={deleteUserMutation.isPending ? <CircularProgress size={16} /> : <Delete />}
            type="button"
          >
            {deleteUserMutation.isPending ? 'Deleting...' : 'Delete My Account'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
