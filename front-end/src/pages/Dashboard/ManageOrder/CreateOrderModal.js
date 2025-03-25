import React, { useState } from 'react';
import { Button, Box, TextField, Typography, Grid, Select, MenuItem, InputLabel, FormControl, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import SearchProduct from './SearchProduct';
import OrderService from '../../../services/api/OrderService';
import { useNavigate } from 'react-router-dom';

const CreateOrderModal = ({ open, onClose }) => {
  const [items, setItems] = useState([]);
  const [contactInfo, setContactInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('Cash On Delivery');
  const navigate = useNavigate();

  const handleCreateOrder = async () => {
    if (!contactInfo.name || !contactInfo.phone) {
      toast.error('Please fill out all required fields.');
      return;
    }
    const orderData = {
      items,
      contactInfo,
      paymentMethod,
    };
    try {
      await OrderService.createOrder(orderData);
      toast.success('Create order successfully');
      setTimeout(() => {
        navigate('/manage-order');
      }, 3000);
      onClose();
    } catch (error) {
      toast.error('Error creating order');
    }
  };

  const handleContactInfoChange = (e) => {
    const { name, value } = e.target;
    setContactInfo(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Create Order</DialogTitle>
      <DialogContent>
        <ToastContainer />
        <Box sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Name"
                variant="outlined"
                fullWidth
                name="name"
                value={contactInfo.name}
                onChange={handleContactInfoChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Email"
                variant="outlined"
                fullWidth
                name="email"
                value={contactInfo.email}
                onChange={handleContactInfoChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Phone"
                variant="outlined"
                fullWidth
                name="phone"
                value={contactInfo.phone}
                onChange={handleContactInfoChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Address"
                variant="outlined"
                fullWidth
                name="address"
                value={contactInfo.address}
                onChange={handleContactInfoChange}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Payment Method</InputLabel>
                <Select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <MenuItem value="Cash On Delivery">Cash On Delivery</MenuItem>
                  <MenuItem value="VnPay">VnPay</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <SearchProduct items={items} setItems={setItems} />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">Cancel</Button>
        <Button onClick={handleCreateOrder} color="primary">Create Order</Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateOrderModal;
