import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Title from '../Title';
import ProductService from '../../../services/api/ProductService'
import SpecsDialog from './SpecsDialog';
import InStockDialog from './InStockDialog';
import DescDialog from './DescDialog'
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { useSearchParams, useNavigate } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import Tooltip from '@mui/material/Tooltip';
import ImageDialog from './ImageDialog';
import UpdateProduct from './UpdateProduct';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import { Button } from '@mui/material';
import DialogTitle from '@mui/material/DialogTitle';
import { Grid } from '@mui/material';
import { TextField } from '@mui/material';
import Typography from '@mui/material/Typography';


export default function Products() {
  const [searchParams] = useSearchParams();
  const [currentPageNumber, setCurrentPageNumber] = React.useState(1);
  const [productData, setProductData] = React.useState({ products: [], totalPages: 0 });
  const navigate = useNavigate();

  // Handle search product
  const [keywords, setKeywords] = React.useState("");

  const handleSearchByName = async () => {
    setProductData(await ProductService.getPaginatedProductsByName(keywords, currentPageNumber, 10));
    if (keywords.trim().length === 0) {
      setProductData(await ProductService.getPaginatedAllProducts(currentPageNumber, 10));
    }
  }

  React.useEffect(() => {
    const page = parseInt(searchParams.get('page')) || 1;
    setCurrentPageNumber(page);
  }, [pageParams, keywordsParams, sortByParams])

  React.useEffect(() => {
    if (keywords.trim().length === 0) {
      const fetchProducts = async () => {
        const data = await ProductService.getPaginatedAllProducts(currentPageNumber, 10);
        setProductData(data);
      };
      fetchProducts();
    } else {
      handleSearchByName();
    }
  }, [currentPageNumber, keywords])

  const handleChangePage = (event, value) => {
    setCurrentPageNumber(value);
    navigate(`/manage-product/?page=${value}`);
  }

  // handle xóa mềm
  const [openAskToDelete, setOpenAskToDelete] = React.useState(false);
  const [selectedProductId, setSelectedProductId] = React.useState(null);
  const handleOpenAskToDelete = (productId) => {
    setSelectedProductId(productId);
    setOpenAskToDelete(true);
  };

  const handleSoftDeleteProduct = async () => {
    await ProductService.softDeleteProduct(selectedProductId);
    const data = await ProductService.getPaginatedAllProducts(currentPageNumber, 10);
    setProductData(data);
    setOpenAskToDelete(false);
  }

  return (
    <React.Fragment>
      <Grid container spacing={2} mb={3}>
        <Grid item xs={6}>
          <TextField required value={keywords} onChange={(e) => setKeywords(e.target.value)} size="small" fullWidth id="outlined-basic" label="Search name" variant="outlined" />
        </Grid>
        <Grid item xs={2}>
          <Button onClick={handleSearchByKeywords} variant="contained" endIcon={<SearchIcon />}>
            Search
          </Button>
        </Grid>
      </Grid>
      {
        productData?.products && (
          <Grid item>
            <Typography color="error" variant="caption" display="block" gutterBottom>
              Found {productData?.totalProducts} products
            </Typography>
          </Grid>
        )
      }
      <Grid item xs={12}>
        <Title>Products</Title>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Brand</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Available</TableCell>
              <TableCell>Desc</TableCell>
              <TableCell>Specs</TableCell>
              <TableCell>Images</TableCell>
              <TableCell>In stock</TableCell>
              <TableCell>Cost</TableCell>
              <TableCell align="right">Price</TableCell>
              <TableCell>Tool</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {productData?.products?.map((product, index) => (
              <TableRow style={{ cursor: 'pointer' }} key={product._id}>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.brand?.name}</TableCell>
                <TableCell>{product.category?.name}</TableCell>
                <TableCell>{product.isAvailable.toString()}</TableCell>
                <TableCell><DescDialog description={product.description} /></TableCell>
                <TableCell><SpecsDialog specs={product.specs} /></TableCell>
                <TableCell><ImageDialog images={product.images} /></TableCell>
                <TableCell><InStockDialog inStock={product.inStock} /></TableCell>
                <TableCell>{`$${product.cost}`}</TableCell>
                <TableCell align="right">{`$${product.price}`}</TableCell>
                <TableCell>
                  <Tooltip title="Update">
                    <UpdateProduct targetProduct={product}></UpdateProduct>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <DeleteIcon color="error" style={{ cursor: 'pointer' }} onClick={() => handleOpenAskToDelete(product._id)} />
                  </Tooltip>
                  <Dialog
                    open={openAskToDelete}
                    onClose={() => setOpenAskToDelete(false)}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                  >
                    <DialogTitle id="alert-dialog-title">
                      {"Do you want to delete this document?"}
                    </DialogTitle>
                    <DialogContent>
                      <DialogContentText id="alert-dialog-description">
                        Deleting records is essentially just soft deletion. You can review deleted records in the trash but cannot restore them.
                      </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={() => setOpenAskToDelete(false)}>Cancel</Button>
                      <Button color='error' onClick={handleSoftDeleteProduct} autoFocus>
                        Delete
                      </Button>
                    </DialogActions>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Stack spacing={2} sx={{ mt: 3 }}>
          <Pagination
            page={currentPageNumber}
            count={productData.totalPages}
            onChange={handleChangePage}
            showFirstButton
            showLastButton
            sx={{ display: 'flex', justifyContent: 'center' }}
          />
        </Stack>
      </Grid>
    </React.Fragment>
  );
}
