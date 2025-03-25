import React, { useState } from 'react';
import { Button, Box, TextField, Typography, Grid, Select, MenuItem, InputLabel, FormControl, Dialog } from '@mui/material';
import OrderService from '../../../services/api/OrderService';
import SearchProduct from './SearchProduct';
import { toast } from 'react-toastify';
const CreateOrder = ({ open, onClose }) => {
  // const [userId, setUserId] = useState('');
  const [items, setItems] = useState([]);
  const [contactInfo, setContactInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('Cash On Delivery');
  const handleCreateOrder = async () => {
    if (!contactInfo.name || !contactInfo.phone) {
      alert('Please fill out all required fields.');
      return;
    }
    const orderData = {
      // userId,
      items,
      contactInfo,
      // shippingFee: '20' ,
      paymentMethod,
    };
    try {
      await OrderService.createOrder(orderData);
      toast.success('Create order successfully');
      setItems([]);
      setContactInfo({
        name: '',
        email: '',
        phone: '',
        address: '',
      });
      onClose();
      // setTimeout(() => {
      //   navigate('/manage-order');
      // }, 3000);
      // Optionally, reset the form or navigate to another page
    } catch (error) {
      toast.error('Error create order');
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
    <div>
      <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
        <Box sx={{ p: 3, bgcolor: 'background.paper', borderRadius: 1 }}>
          <Typography sx={{ mb: 4 }} variant="h4" gutterBottom>
            Create Order
          </Typography>
          <Grid container spacing={2}>
            {/* <Grid item xs={12} sm={6}>
          <TextField
            label="User ID"
            variant="outlined"
            fullWidth
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />
        </Grid> */}
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
            <Grid item xs={12}>
              <Button onClick={onClose} color="secondary">Cancel</Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleCreateOrder}
              >
                Create Order
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Dialog>
    </div>
  );
};

export default CreateOrder;
