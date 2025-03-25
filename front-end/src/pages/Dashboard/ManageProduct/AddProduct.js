import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Zoom from '@mui/material/Zoom';
import Fab from '@mui/material/Fab';
import Tooltip from '@mui/material/Tooltip';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import AddIcon from '@mui/icons-material/Add';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableFooter from '@mui/material/TableFooter';
import AddBoxIcon from '@mui/icons-material/AddBox';
import IndeterminateCheckBoxIcon from '@mui/icons-material/IndeterminateCheckBox';
import CategoryService from '../../../services/api/CategoryService';
import BrandService from '../../../services/api/BrandService';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import ProductService from '../../../services/api/ProductService';
import Notification from './Notification';
const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

export default function AddProduct() {
    // các state nhỏ
    const [openAddProductDialog, setOpenAddProductDialog] = React.useState(false);
    const [openAddCategoryDialog, setOpenAddCategoryDialog] = React.useState(false);
    const [openAddBrandDialog, setOpenAddBrandDialog] = React.useState(false);
    const [keySpecs, setKeySpecs] = React.useState("");
    const [valueSpecs, setValueSpecs] = React.useState("");
    const [colorInstock, setColorInstock] = React.useState("");
    const [quantityInstock, setQuantityInstock] = React.useState(0);
    const [newBrand, setNewBrand] = React.useState({});
    const [newCategory, setNewCategory] = React.useState({});
    const [brands, setBrands] = React.useState([]);
    const [categories, setCategories] = React.useState([]);

    // Các state form data
    const [name, setName] = React.useState("");
    const [description, setDescription] = React.useState("");
    const [brand, setBrand] = React.useState("");
    const [category, setCategory] = React.useState("");
    const [specs, setSpecs] = React.useState([]);
    const [instock, setInstock] = React.useState([]);
    const [price, setPrice] = React.useState(0);
    const [cost, setCost] = React.useState(0);
    const [isAvailable, setIsAvaiable] = React.useState(true);
    const [images, setImages] = React.useState([]);

    // Xử lý notification
    const [showNotification, setShowNotification] = React.useState(false);
    const [contentNotification, setContentNotification] = React.useState("");
    const [severity, setSeriverity] = React.useState("info");
    const handleShowNotification = (isShowNotification) => {
        setShowNotification(isShowNotification);
    }
    // Xong phần xử lý notification

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setImages(files);
    };

    const handleResetForm = () => {
        setKeySpecs("");
        setValueSpecs("");
        setColorInstock("");
        setQuantityInstock(0);

        setName("");
        setDescription("");
        setBrand("");
        setCategory("");
        setSpecs([]);
        setInstock([]);
        setPrice(0);
        setCost(0);
        setIsAvaiable(true);
        setImages([]);
    }

    const handleAddProduct = async (e) => {
        e.preventDefault();
        const result = await ProductService.addProduct(name, description, brand, category, price, cost, isAvailable, specs, instock, images);
        if (result.data?.success === true) {
            setShowNotification(true);
            setContentNotification("Add product successfully!");
            setSeriverity("success");
            handleResetForm();
        } else {
            setShowNotification(true);
            setContentNotification(result.data.message);
            setSeriverity("error");
        }
    };


    React.useEffect(() => {
        (async () => {
            setCategories(await CategoryService.getAllCategories());
        })();
    }, [])

    React.useEffect(() => {
        (async () => {
            setBrands(await BrandService.getAllBrands());
        })();
    }, [])

    const handleCreateCategory = async () => {
        await CategoryService.createCategory(newCategory);
        setCategories(await CategoryService.getAllCategories());
        setOpenAddCategoryDialog(false);
    }

    const handleCreateBrand = async () => {
        await BrandService.createBrand(newBrand);
        setBrands(await BrandService.getAllBrands());
        setOpenAddBrandDialog(false);
    }

    const handleAddSpecs = () => {
        if (keySpecs.trim() !== "" && valueSpecs.trim() !== "") {
            setSpecs(prev => {
                return [
                    ...prev,
                    {
                        key: keySpecs,
                        value: valueSpecs
                    }
                ];
            });
            setKeySpecs("");
            setValueSpecs("");
        }
    };

    const handleAddInstock = () => {
        if (colorInstock.trim() !== "" && quantityInstock.trim() !== "") {
            setInstock(prev => {
                return [
                    ...prev,
                    {
                        color: colorInstock,
                        quantity: quantityInstock
                    }
                ];
            });
            setColorInstock("");
            setQuantityInstock(0);
        }
    };

    const handleDeleteSpecs = (specsItem) => {
        const newData = specs.filter(item => {
            return item !== specsItem
        })
        setSpecs(newData)
    };

    const handleDeleteInstock = (instockItem) => {
        const newData = instock.filter(item => {
            return item !== instockItem
        })
        setInstock(newData)
    };

    const handleClickOpenAddBrandDialog = () => {
        setOpenAddBrandDialog(true);
    };

    const handleCloseAddBrandDialog = () => {
        setOpenAddBrandDialog(false);
    };

    const handleClickOpenAddCategoryDialog = () => {
        setOpenAddCategoryDialog(true);
    };

    const handleCloseAddCategoryDialog = () => {
        setOpenAddCategoryDialog(false);
    };

    const handleClickOpenAddProductDialog = () => {
        setOpenAddProductDialog(true);
    };
    const handleCloseAddProductDialog = () => {
        setOpenAddProductDialog(false);
    };
    const theme = useTheme();

    const transitionDuration = {
        enter: theme.transitions.duration.enteringScreen,
        exit: theme.transitions.duration.leavingScreen,
    };

    return (
        <>
            <Tooltip title="Add new product">
                <Zoom
                    key='primary'
                    in={true}
                    timeout={transitionDuration}
                    style={{
                        transitionDelay: `${transitionDuration.exit}ms`,
                    }}
                    unmountOnExit
                >

                    <Fab aria-label='Add' color='primary' >
                        <React.Fragment>
                            <AddIcon onClick={handleClickOpenAddProductDialog}></AddIcon>
                            <Dialog
                                open={openAddProductDialog}
                                onClose={handleCloseAddProductDialog}
                                maxWidth="md"
                            >
                                <DialogTitle>Add New Product</DialogTitle>
                                <DialogContent>
                                    <Notification handleShowNotification={handleShowNotification} showNotification={showNotification} contentNotification={contentNotification} severity={severity} ></Notification>
                                    <DialogContentText>
                                        To add new products to the store, please fill out the information below and submit a request.
                                    </DialogContentText>
                                    <Grid sx={{ mt: 3 }} container spacing={2}>
                                        <Grid item xs={3}>
                                            <Button
                                                component="label"
                                                role={undefined}
                                                variant="contained"
                                                tabIndex={-1}
                                                startIcon={<CloudUploadIcon />}
                                            >
                                                Upload Image
                                                <VisuallyHiddenInput type="file" accept="image/png, image/jpeg" multiple onChange={handleImageChange} />
                                            </Button>
                                        </Grid>
                                        <Grid item xs={9}>
                                            <Typography variant="caption" gutterBottom>
                                                {images.length} file uploaded
                                            </Typography>
                                        </Grid>

                                        <Grid item xs={6}>
                                            <TextField fullWidth id="standard-basic" label="Name" variant="standard" value={name} onChange={e => setName(e.target.value)} />
                                        </Grid>
                                        <Grid item xs={3}>
                                            <TextField
                                                id="standard-select-currency"
                                                select
                                                label="Brand"
                                                helperText="Select your brand"
                                                variant="standard"
                                                fullWidth
                                                value={brand}
                                                onChange={(e) => setBrand(e.target.value)}
                                            >
                                                {brands.map((brand) => (
                                                    <MenuItem key={brand?._id} value={brand?._id}>
                                                        {brand?.name}
                                                    </MenuItem>
                                                ))}
                                                <MenuItem sx={{ diplay: 'flex', justifyContent: 'center' }} onClick={handleClickOpenAddBrandDialog}>
                                                    <AddIcon color="primary" >
                                                    </AddIcon>
                                                </MenuItem>
                                            </TextField>
                                            <Dialog
                                                open={openAddBrandDialog}
                                                onClose={handleCloseAddBrandDialog}
                                            >
                                                <DialogTitle>Add new category</DialogTitle>
                                                <DialogContent>
                                                    <DialogContentText>
                                                        Please enter all of the following information to add a new brand. Note that when a new brand is added, it cannot be deleted.
                                                    </DialogContentText>
                                                    <TextField
                                                        autoFocus

                                                        margin="dense"
                                                        label="Brand name"
                                                        type="text"
                                                        fullWidth
                                                        variant="standard"
                                                        onChange={(e) => setNewBrand(prev => ({
                                                            ...prev,
                                                            name: e.target.value
                                                        }))}
                                                    />
                                                    <TextField

                                                        sx={{ mt: 3 }}
                                                        id="outlined-multiline-static"
                                                        label="Descriptions"
                                                        multiline
                                                        rows={4}
                                                        fullWidth
                                                        onChange={(e) => setNewBrand(prev => ({
                                                            ...prev,
                                                            description: e.target.value
                                                        }))}
                                                    />
                                                </DialogContent>
                                                <DialogActions>
                                                    <Button onClick={handleCloseAddBrandDialog}>Cancel</Button>
                                                    <Button onClick={handleCreateBrand}>Add brand</Button>
                                                </DialogActions>
                                            </Dialog>
                                        </Grid>
                                        <Grid item xs={3}>
                                            <TextField
                                                id="standard-select-currency"
                                                select
                                                label="Category"
                                                helperText="Select your category"
                                                variant="standard"
                                                fullWidth
                                                value={category}
                                                onChange={(e) => setCategory(e.target.value)}
                                            >
                                                {categories.length > 0 && categories.map((cate) => (
                                                    <MenuItem key={cate?._id} value={cate?._id}>
                                                        {cate?.name}
                                                    </MenuItem>
                                                ))}
                                                <MenuItem sx={{ diplay: 'flex', justifyContent: 'center' }} onClick={handleClickOpenAddCategoryDialog} >
                                                    <AddIcon color="primary" >
                                                    </AddIcon>
                                                </MenuItem>
                                            </TextField>
                                            <Dialog
                                                open={openAddCategoryDialog}
                                                onClose={handleCloseAddCategoryDialog}
                                            >
                                                <DialogTitle>Add new category</DialogTitle>
                                                <DialogContent>
                                                    <DialogContentText>
                                                        Please enter all of the following information to add a new category. Note that when a category is newly added, it cannot be deleted.
                                                    </DialogContentText>
                                                    <TextField
                                                        autoFocus

                                                        margin="dense"
                                                        label="Category name"
                                                        type="text"
                                                        fullWidth
                                                        variant="standard"
                                                        value={newCategory?.name}
                                                        onChange={(e) => setNewCategory(prev => ({
                                                            ...prev,
                                                            name: e.target.value
                                                        }))}
                                                    />
                                                    <TextField

                                                        sx={{ mt: 3 }}
                                                        id="outlined-multiline-static"
                                                        label="Descriptions"
                                                        multiline
                                                        rows={4}
                                                        fullWidth
                                                        value={newCategory?.description}
                                                        onChange={(e) => setNewCategory(prev => ({
                                                            ...prev,
                                                            description: e.target.value
                                                        }))}
                                                    />
                                                </DialogContent>
                                                <DialogActions>
                                                    <Button onClick={handleCloseAddCategoryDialog}>Cancel</Button>
                                                    <Button onClick={handleCreateCategory}>Add category</Button>
                                                </DialogActions>

                                            </Dialog>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                id="filled-textarea"
                                                variant="filled"
                                                label="Description"
                                                multiline
                                                rows={3}
                                                fullWidth
                                                value={description} onChange={e => setDescription(e.target.value)}
                                            />
                                        </Grid>

                                        <Grid item xs={6}>
                                            <TableContainer component={Paper}>
                                                <Table size="small" >
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell align="center" colSpan={2}>
                                                                Specification
                                                            </TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {
                                                            specs.length > 0 && specs.map((spec, index) => {
                                                                return (
                                                                    <React.Fragment key={index}>
                                                                        <TableRow>
                                                                            <TableCell component="th" scope="row">
                                                                                {spec.key}
                                                                            </TableCell>
                                                                            <TableCell align="right">
                                                                                {spec.value}
                                                                            </TableCell>
                                                                            <TableCell align="right">
                                                                                <IndeterminateCheckBoxIcon style={{ cursor: 'pointer' }} fontSize="medium" color="error" onClick={() => handleDeleteSpecs(spec)}></IndeterminateCheckBoxIcon>
                                                                            </TableCell>
                                                                        </TableRow>
                                                                    </React.Fragment>
                                                                )
                                                            })
                                                        }
                                                    </TableBody>
                                                    <TableFooter>
                                                        <TableRow>
                                                            <TableCell component="th" scope="row">
                                                                <TextField id="standard-basic" label="Key" value={keySpecs} variant="standard" onChange={event => setKeySpecs(event.target.value)} />
                                                            </TableCell>
                                                            <TableCell >
                                                                <TextField id="standard-basic" label="Value" value={valueSpecs} variant="standard" onChange={event => setValueSpecs(event.target.value)} />
                                                            </TableCell>
                                                            <TableCell align="right">
                                                                <AddBoxIcon style={{ cursor: 'pointer' }} fontSize="medium" color="primary" onClick={handleAddSpecs}></AddBoxIcon>
                                                            </TableCell>
                                                        </TableRow>
                                                    </TableFooter>
                                                </Table>
                                            </TableContainer>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <TableContainer component={Paper}>
                                                <Table size="small" >
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell align="center" colSpan={2}>
                                                                In Stock
                                                            </TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {
                                                            instock.length > 0 && instock.map((item, index) => {
                                                                return (
                                                                    <React.Fragment key={index}>
                                                                        <TableRow>
                                                                            <TableCell component="th" scope="row">
                                                                                {item.color}
                                                                            </TableCell>
                                                                            <TableCell align="right">
                                                                                {item.quantity}
                                                                            </TableCell>
                                                                            <TableCell align="right">
                                                                                <IndeterminateCheckBoxIcon style={{ cursor: 'pointer' }} fontSize="medium" color="error" onClick={() => handleDeleteInstock(item)}></IndeterminateCheckBoxIcon>
                                                                            </TableCell>
                                                                        </TableRow>
                                                                    </React.Fragment>
                                                                )
                                                            })
                                                        }
                                                    </TableBody>
                                                    <TableFooter>
                                                        <TableRow>
                                                            <TableCell component="th" scope="row">
                                                                <TextField id="standard-basic" label="Color" variant="standard" value={colorInstock} onChange={event => setColorInstock(event.target.value)} />
                                                            </TableCell>
                                                            <TableCell >
                                                                <TextField id="standard-basic" type="number" label="Quantity" variant="standard" value={quantityInstock} onChange={event => setQuantityInstock(event.target.value)} />
                                                            </TableCell>
                                                            <TableCell align="right">
                                                                <AddBoxIcon style={{ cursor: 'pointer' }} fontSize="medium" color="primary" onClick={handleAddInstock}></AddBoxIcon>
                                                            </TableCell>
                                                        </TableRow>
                                                    </TableFooter>
                                                </Table>
                                            </TableContainer>
                                        </Grid>
                                        <Grid item xs={4}>
                                            <FormControl fullWidth sx={{ m: 1 }} variant="standard">
                                                <InputLabel htmlFor="standard-adornment-amount">Price</InputLabel>
                                                <Input
                                                    id="standard-adornment-amount"
                                                    startAdornment={<InputAdornment position="start">$</InputAdornment>}
                                                    value={price}
                                                    onChange={e => setPrice(e.target.value)}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={4}>
                                            <FormControl fullWidth sx={{ m: 1 }} variant="standard" >
                                                <InputLabel htmlFor="standard-adornment-amount">Cost</InputLabel>
                                                <Input
                                                    id="standard-adornment-amount"
                                                    startAdornment={<InputAdornment position="start">$</InputAdornment>}
                                                    value={cost}
                                                    onChange={e => setCost(e.target.value)}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={1}></Grid>
                                        <Grid item xs={3}>
                                            <TextField
                                                id="standard-select-currency"
                                                select
                                                label="Is this product still available for sale?"
                                                variant="standard"
                                                fullWidth
                                                value={isAvailable}
                                                onChange={e => setIsAvaiable(e.target.value)}
                                            >
                                                <MenuItem value="true">
                                                    Yes
                                                </MenuItem>
                                                <MenuItem value="false">
                                                    No
                                                </MenuItem>
                                            </TextField>
                                        </Grid>
                                    </Grid>
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={handleCloseAddProductDialog}>Cancel</Button>
                                    <Button type="submit" onClick={handleAddProduct}>Submit</Button>
                                </DialogActions>
                            </Dialog>
                        </React.Fragment>
                    </Fab>
                </Zoom>
            </Tooltip>
        </>

    );
}
