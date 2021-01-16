import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

import { AddBasketFunc } from '../requests/index'

const AddBasket = React.forwardRef(({ open, handleClose, Success }, ref) => {

    const [name, setName] = React.useState('');
    const [error, setError] = React.useState({
        error: false,
        helper: ''
    });

  const handleDialogClose = () => {
    handleClose();
  };

  const handleSubmit = async () => {
      if (!name) {
        setError({
          error: true,
          helper: 'This field is required'
        })
      } else {
        const response = await AddBasketFunc({
          name: name
        })
        if (response) {
            setError({
              error: false,
              helper: ''
            })
            setName('')
            Success()
        }
      }
  }

  return (
      <Dialog open={open} onClose={handleDialogClose}
        fullWidth={true}
        maxWidth={'sm'}
        ref={ref}
      >
        <DialogTitle>Add new basket</DialogTitle>
        <DialogContent>
          <TextField
            error = {error.error}
            autoFocus
            margin="dense"
            helperText={error.helper}
            id="name"
            label="Basket name"
            type="text"
            value={name}
            fullWidth
            onChange={(event) => setName(event.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
  );
})

export default AddBasket;