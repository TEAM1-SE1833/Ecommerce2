import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import PaymentIcon from '@mui/icons-material/Payment';

export default function PaymentDetailDialog({ order }) {
    const [open, setOpen] = React.useState(false);
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <React.Fragment>
            <Tooltip title="View payment detail">
                <PaymentIcon fontSize='small' color="info" onClick={() => handleClickOpen()}></PaymentIcon>
            </Tooltip>
            <Dialog
                open={open}
                onClose={handleClose}
                maxWidth="md"
            >
                <DialogTitle>Payment detail</DialogTitle>
                <DialogContent>
                    {
                        order && <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Status</TableCell>
                                        <TableCell align="right">Method</TableCell>
                                        <TableCell align="right">Transaction ID</TableCell>
                                        <TableCell align="right">Payment Time</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>

                                    <TableRow
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row">
                                            {order?.paymentStatus}
                                        </TableCell>
                                        <TableCell align="right">{order?.paymentMethod}</TableCell>
                                        <TableCell align="right">{order?.paymentDetails?.transactionId}</TableCell>
                                        <TableCell align="right">{order?.paymentDetails?.paymentTime}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    }
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}
