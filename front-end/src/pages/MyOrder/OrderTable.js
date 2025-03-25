import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Box, Typography, Button } from '@mui/material';
import { Visibility } from '@mui/icons-material';

const OrderTable = ({ orders, handleOpen }) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Product</TableCell>
            <TableCell>Contact Info</TableCell>
            <TableCell>Total Price</TableCell>
            <TableCell>Order Status</TableCell>
            <TableCell>Payment Status</TableCell>
            <TableCell>View Details</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order._id}>
              <TableCell>
                <Box display="flex" flexDirection="column">
                  <Typography>{order.items[0].productId.name}</Typography>
                  {order.items.length > 1 && (
                    <Button size="small" onClick={() => handleOpen(order)}>View More Products</Button>
                  )}
                </Box>
              </TableCell>
              <TableCell>
                {order?.contactInfo
                  ? `${order.contactInfo.name}, ${order.contactInfo.email}, ${order.contactInfo.phone}, ${order.contactInfo.address}`
                  : 'N/A'}
              </TableCell>
              <TableCell>{order.totalPrice}đ</TableCell>
              <TableCell>{order.orderStatus}</TableCell>
              <TableCell>{order.paymentStatus}</TableCell>
              <TableCell>
                <IconButton onClick={() => handleOpen(order)}>
                  <Visibility />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default OrderTable;
