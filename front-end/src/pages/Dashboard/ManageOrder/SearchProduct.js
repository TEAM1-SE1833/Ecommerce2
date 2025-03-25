import React, { useState } from 'react';
import {
    Button, Grid, TextField, List, ListItem, ListItemText,
    IconButton, FormControl, InputLabel, Select, MenuItem,
    Typography, Box, Paper, Divider
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete'; // Import DeleteIcon
import OrderService from '../../../services/api/OrderService';
import { toast } from 'react-toastify';

const SearchProduct = ({ items, setItems }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    const handleAddItem = (product) => {
        const newItem = {
            productId: product._id,
            name: product.name,
            quantity: 1,
            salePrice: product.price,
            saleCost: product.cost,
            color: 'unknown', // Initially empty, to be selected later
            availableColors: product.inStock.map(stock => stock.color),
        };
        setItems([...items, newItem]);
    };

    const handleItemChange = (index, key, value) => {
        const updatedItems = items.map((item, idx) => {
            if (index === idx) {
                return { ...item, [key]: value };
            }
            return item;
        });
        setItems(updatedItems);
    };

    const handleDeleteItem = (index) => {
        const updatedItems = [...items];
        updatedItems.splice(index, 1);
        setItems(updatedItems);
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission
        if (searchQuery.length >= 3) {
            const results = await OrderService.searchProducts(searchQuery);
            setSearchResults(results);
        } else {
            toast.error('Please enter at least 3 characters to search');
            setSearchResults([]);
        }
    };

    const handleSearchButtonClick = () => {
        handleSubmit({ preventDefault: () => { } });
    };

    return (
        <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
                <Paper elevation={3} sx={{ p: 2 }}>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', alignItems: 'center' }}>
                        <TextField
                            label="Search by name or description to add products"
                            variant="outlined"
                            fullWidth
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <Button variant="contained" onClick={handleSearchButtonClick} sx={{ ml: 2 }}>Search</Button>
                    </form>
                    <Box sx={{ mt: 2, maxHeight: 300, overflow: 'auto' }}>
                        <List>
                            {searchResults.map(product => (
                                <ListItem key={product._id}>
                                    <ListItemText
                                        primary={`${product.name} (Brand: ${product.brand.name}, Category: ${product.category.name})`}
                                        secondary={`Price: ${product.price}`}
                                    />
                                    <IconButton onClick={() => handleAddItem(product)}>
                                        <AddIcon />
                                    </IconButton>
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
                <Paper elevation={3} sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                        Selected Items
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <List>
                        {items.map((item, index) => (
                            <ListItem key={index} disablePadding>
                                <ListItemText
                                    primary={`${item.name} (Price: ${item.salePrice})`}
                                />
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <FormControl sx={{ mr: 2 }}>
                                        <InputLabel>Color</InputLabel>
                                        <Select
                                            value={item.color}
                                            onChange={(e) => handleItemChange(index, 'color', e.target.value)}
                                        >
                                            {item.availableColors.map((color, idx) => (
                                                <MenuItem key={idx} value={color}>{color}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                    <TextField
                                        type="number"
                                        label="Quantity"
                                        value={item.quantity}
                                        onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                                        sx={{ width: '80px', mr: 2 }}
                                    />
                                    <IconButton onClick={() => handleDeleteItem(index)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </Box>
                            </ListItem>
                        ))}
                    </List>
                </Paper>
            </Grid>
        </Grid>
    );
};

export default SearchProduct;
