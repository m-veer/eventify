import { Dialog, DialogTitle, DialogActions, Button } from "@mui/material";

interface DeleteConfirmationModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  open,
  onClose,
  onConfirm
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          bgcolor: '#ffffff',
          borderRadius: '8px',
          minWidth: '400px',
          p: 2,
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)'
        }
      }}
    >
      <DialogTitle sx={{ 
        color: '#000000',
        textAlign: 'left',
        fontSize: '1rem',
        pb: 2
      }}>
        Are you sure you want to delete this user?
      </DialogTitle>
      <DialogActions sx={{ 
        justifyContent: 'flex-end',
        gap: 1,
        pt: 1 
      }}>
        <Button
          onClick={onClose}
          sx={{
            color: '#666666',
            '&:hover': {
              bgcolor: 'rgba(0, 0, 0, 0.04)'
            }
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          sx={{
            bgcolor: '#ff0000',
            color: '#ffffff',
            '&:hover': {
              bgcolor: '#d32f2f'
            }
          }}
        >
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmationModal;