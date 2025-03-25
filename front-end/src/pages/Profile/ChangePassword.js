import React, { useState } from 'react';
import { Box, TextField, Button } from '@mui/material';
import AuthenService from '../../services/api/AuthenService';
import { toast } from 'react-toastify';

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    if (name === 'currentPassword') {
      setCurrentPassword(value);
    } else if (name === 'newPassword') {
      setNewPassword(value);
    } else if (name === 'confirmPassword') {
      setConfirmPassword(value);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    try {
      const passwordData = {
        oldPassword: currentPassword,
        newPassword: newPassword
      };
      await AuthenService.changePassword(passwordData);
      toast.success('Password changed successfully');
    } catch (error) {
      toast.error('Error changing password');
    }
  };

  return (
    <Box>
      <form onSubmit={handlePasswordSubmit}>
        <TextField
          label="Current Password"
          name="currentPassword"
          type="password"
          value={currentPassword}
          onChange={handlePasswordChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="New Password"
          name="newPassword"
          type="password"
          value={newPassword}
          onChange={handlePasswordChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Confirm New Password"
          name="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={handlePasswordChange}
          fullWidth
          margin="normal"
        />
        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
          Change Password
        </Button>
      </form>
    </Box>
  );
};

export default ChangePassword;
