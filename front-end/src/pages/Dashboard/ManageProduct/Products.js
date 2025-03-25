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
import { useSearchParams, useNavigate, createSearchParams } from 'react-router-dom';
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
import SearchIcon from '@mui/icons-material/Search';

export default function Products() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const pageParams = parseInt(searchParams.get('page') || 1);
  const keywordsParams = searchParams.get('keywords');
  const sortByParams = searchParams.get('sortBy');


  // Các state params
  const [keywords, setKeywords] = React.useState(keywordsParams || '');

  // handle fetch data
  const [productData, setProductData] = React.useState({ products: [], totalPages: 0 });
  React.useEffect(() => {
    const fetchProducts = async () => {
      const data = await ProductService.getPaginatedProducts(pageParams, 10, keywordsParams, sortByParams);
      setProductData(data);
    };
    fetchProducts();
  }, [pageParams, keywordsParams, sortByParams])

  const handleNavigate = (params) => {
    !params.page && pageParams && (params.page = pageParams)
    !params.keywords && keywordsParams && (params.keywords = keywordsParams)
    !params.sortBy && sortByParams && (params.sortBy = sortByParams);
    params.keywords === 'all' && delete params.keywords
    params.sortBy === 'all' && delete params.sortBy
    params.sortBy === sortByParams && delete params.sortBy
    navigate({
      pathname: '/manage-product',
      search: createSearchParams(params).toString()
    });
  }

  const handleChangePage = (event, value) => {
    const params = {
      page: value
    }
    handleNavigate(params);
  }

  const handleSearchByKeywords = async () => {
    const params = {
      page: 1,
      sortBy: "all"
    }
    if (keywords.trim().length === 0) {
      params.keywords = "all"
    } else {
      params.keywords = keywords.trim();
    }
    handleNavigate(params);
  }

  const handleSortProduct = (sortByValue) => {
    const params = {
      sortBy: sortByValue
    }
    handleNavigate(params);
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
    const data = await ProductService.getPaginatedProducts(pageParams, 10, keywordsParams, sortByParams);
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
              <TableCell ><Typography color="primary" style={{ cursor: 'pointer' }} onClick={() => handleSortProduct("name")}>Name</Typography></TableCell>
              <TableCell ><Typography color="primary" style={{ cursor: 'pointer' }} onClick={() => handleSortProduct("brand")}>Brand</Typography></TableCell>
              <TableCell ><Typography color="primary" style={{ cursor: 'pointer' }} onClick={() => handleSortProduct("category")}>Category</Typography></TableCell>
              <TableCell ><Typography color="primary" style={{ cursor: 'pointer' }} onClick={() => handleSortProduct("avaiable")}>Available</Typography></TableCell>
              <TableCell ><Typography color="primary" >Desc</Typography></TableCell>
              <TableCell ><Typography color="primary" >Specs</Typography></TableCell>
              <TableCell ><Typography color="primary" >Images</Typography></TableCell>
              <TableCell ><Typography color="primary" >In stock</Typography></TableCell>
              <TableCell ><Typography color="primary" style={{ cursor: 'pointer' }} onClick={() => handleSortProduct("cost")}>Cost</Typography></TableCell>
              <TableCell align="right" ><Typography color="primary" style={{ cursor: 'pointer' }} onClick={() => handleSortProduct("price")}>Price</Typography></TableCell>
              <TableCell ><Typography color="primary" >Tool</Typography></TableCell>
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
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Stack spacing={2} sx={{ mt: 3 }}>
          <Pagination
            page={pageParams}
            count={productData.totalPages}
            onChange={handleChangePage}
            showFirstButton
            showLastButton
            sx={{ display: 'flex', justifyContent: 'center' }}
          />
        </Stack>
      </Grid>
      <Grid>
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
      </Grid>
    </React.Fragment>
  );
}
