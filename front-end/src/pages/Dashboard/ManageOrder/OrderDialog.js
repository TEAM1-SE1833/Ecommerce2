// OrderDialog.js
import React from 'react';
import {
  Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button
} from '@mui/material';

const OrderDialog = ({ open, onClose, order, onChange, onSubmit }) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>{order?.id ? 'Edit Order' : 'Create Order'}</DialogTitle>
    <DialogContent>
      <TextField
        autoFocus
        margin="dense"
        name="userId"
        label="User ID"
        fullWidth
        value={order?.userId || ''}
        onChange={onChange}
      />
      <TextField
        margin="dense"
        name="items"
        label="Items"
        fullWidth
        value={order?.items || ''}
        onChange={onChange}
      />
      <TextField
        margin="dense"
        name="totalPrice"
        label="Total Price"
        fullWidth
        value={order?.totalPrice || ''}
        onChange={onChange}
      />
      <TextField
        margin="dense"
        name="orderStatus"
        label="Order Status"
        fullWidth
        value={order?.orderStatus || ''}
        onChange={onChange}
      />
      <TextField
        margin="dense"
        name="paymentStatus"
        label="Payment Status"
        fullWidth
        value={order?.paymentStatus || ''}
        onChange={onChange}
      />
      <TextField
        margin="dense"
        name="paymentDetails"
        label="Payment Details"
        fullWidth
        value={order?.paymentDetails || ''}
        onChange={onChange}
      />
      <TextField
        margin="dense"
        name="contactInfo"
        label="Contact Info"
        fullWidth
        value={order?.contactInfo || ''}
        onChange={onChange}
      />
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose} color="primary">
        Cancel
      </Button>
      <Button onClick={onSubmit} color="primary">
        {order?.id ? 'Update' : 'Create'}
      </Button>
    </DialogActions>
  </Dialog>
);

export default OrderDialog;
