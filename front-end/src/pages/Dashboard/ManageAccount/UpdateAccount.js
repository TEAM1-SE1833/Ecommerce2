import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Tooltip from '@mui/material/Tooltip';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import UserService from '../../../services/api/UserService';
import Notification from './Notification';
import DialogContentText from '@mui/material/DialogContentText';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import BuildCircleIcon from '@mui/icons-material/BuildCircle';

export default function UpdateAccount({ user }) {
    const [open, setOpen] = React.useState(false);
    // Các state form data
    const [email, setEmail] = React.useState(user?.email || "");
    const [fullName, setFullName] = React.useState(user?.fullName || "");
    const [address, setAddress] = React.useState(user?.address || "");
    const [phoneNumber, setPhoneNumber] = React.useState(user?.phoneNumber || "");
    const [role, setRole] = React.useState(user?.role || "");
    const [isVerified, setIsVerified] = React.useState(user?.isVerified);

    // Xử lý notification
    const [showNotification, setShowNotification] = React.useState(false);
    const [contentNotification, setContentNotification] = React.useState("");
    const [severity, setSeriverity] = React.useState("info");
    const handleShowNotification = (isShowNotification) => {
        setShowNotification(isShowNotification);
    }
    // Xong phần xử lý notification

    const handleUpdateUser = async (e) => {
        e.preventDefault();
        const result = await UserService.updateUser(user._id, email, fullName, address, phoneNumber, role, isVerified);
        if (result?.success && result.success === true) {
            setShowNotification(true);
            setContentNotification("Update user successfully!");
            setSeriverity("success");
        } else {
            setShowNotification(true);
            setContentNotification(result.data.message);
            setSeriverity("error");
        }
    };
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <React.Fragment>
            <Tooltip title="Update Account">
                <BuildCircleIcon fontSize='medium' color="info" onClick={() => handleClickOpen()}></BuildCircleIcon>
            </Tooltip>
            <Dialog
                open={open}
                onClose={handleClose}
                maxWidth="md"
            >
                <DialogTitle>Update Account</DialogTitle>
                <DialogContent>
                    <Notification handleShowNotification={handleShowNotification} showNotification={showNotification} contentNotification={contentNotification} severity={severity} ></Notification>
                    <DialogContentText>
                        To Update user in the store, please fill out the information below and submit a request.
                    </DialogContentText>
                    <Grid sx={{ mt: 3 }} container spacing={2}>
                        <Grid item xs={6}>
                            <TextField fullWidth id="standard-basic" label="Email" variant="standard" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField fullWidth id="standard-basic" label="Full Name" variant="standard" value={fullName} onChange={(e) => setFullName(e.target.value)} />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField fullWidth id="standard-basic" label="Address" variant="standard" value={address} onChange={(e) => setAddress(e.target.value)} />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField fullWidth id="standard-basic" label="Phone Number" variant="standard" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                id="standard-select-currency"
                                select
                                label="Role"
                                helperText="Select your role"
                                variant="standard"
                                fullWidth
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                defaultValue="customer"
                            >

                                <MenuItem value={"customer"}>
                                    Customer
                                </MenuItem>
                                <MenuItem value={"sales manager"}>
                                    Sales Manager
                                </MenuItem>
                                <MenuItem value={"admin"}>
                                    Admin
                                </MenuItem>
                            </TextField>
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                id="standard-select-currency"
                                select
                                label="Is Verified"
                                helperText="Select true or false"
                                variant="standard"
                                fullWidth
                                value={isVerified}
                                onChange={(e) => setIsVerified(e.target.value)}
                            >

                                <MenuItem value={"true"}>
                                    True
                                </MenuItem>
                                <MenuItem value={"false"}>
                                    False
                                </MenuItem>
                            </TextField>
                        </Grid>
                    </Grid>

                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button type="submit" onClick={handleUpdateUser}>Submit</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}
