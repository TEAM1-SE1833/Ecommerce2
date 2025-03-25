import React, { useState, useEffect } from 'react';
import { Box, TextField, Button } from '@mui/material';
import AuthenService from '../../services/api/AuthenService';
import { toast } from 'react-toastify';

const UpdateProfile = ({ userData }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');

  useEffect(() => {
    if (userData) {
      setFullName(userData.fullName);
      setEmail(userData.email);
      setPhoneNumber(userData.phoneNumber);
      setAddress(userData.address);
    }
  }, [userData]);

  const handleFullNameChange = (e) => {
    setFullName(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePhoneNumberChange = (e) => {
    setPhoneNumber(e.target.value);
  };

  const handleAddressChange = (e) => {
    setAddress(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const profileData = { fullName, email, phoneNumber, address };
    try {
      await AuthenService.updateProfile(profileData);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Error updating profile');
    }
  };

  return (
    <Box>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Full Name"
          name="fullName"
          value={fullName}
          onChange={handleFullNameChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Email"
          name="email"
          value={email}
          onChange={handleEmailChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Phone Number"
          name="phoneNumber"
          value={phoneNumber}
          onChange={handlePhoneNumberChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Address"
          name="address"
          value={address}
          onChange={handleAddressChange}
          fullWidth
          margin="normal"
        />
        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
          Update Profile
        </Button>
      </form>
    </Box>
  );
};

export default UpdateProfile;
