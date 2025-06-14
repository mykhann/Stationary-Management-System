import React, { useState } from 'react';
import axios from 'axios';
import BASE_URL from '../../apiConfig.js';
import { useDispatch } from 'react-redux';
import { setUser } from '../../reduxStore/authSlice.js';
import { toast } from 'react-toastify';

const ProfileEditForm = ({ user, setIsEditing }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: user.name || '',
    address: user.address || '',
    email: user.email || '',
    phone: user.phone || '',
  });

  const handleChange = e =>
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSave = async () => {
    try {
      const res = await axios.put(`${BASE_URL}/api/v1/user/Update-Profile`, formData, {
        withCredentials: true,
      });
      dispatch(setUser(res.data.user));
      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed');
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user.name || '',
      address: user.address || '',
      email: user.email || '',
      phone: user.phone || '',
    });
    setIsEditing(false);
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <input name="name" value={formData.name} onChange={handleChange} className="border p-2 rounded" />
      <input name="address" value={formData.address} onChange={handleChange} className="border p-2 rounded" />
      <input name="email" value={formData.email} onChange={handleChange} className="border p-2 rounded" />
      <input name="phone" value={formData.phone} onChange={handleChange} className="border p-2 rounded" />
      <div className="flex gap-4">
        <button onClick={handleSave} className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">Save</button>
        <button onClick={handleCancel} className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400">Cancel</button>
      </div>
    </div>
  );
};

export default ProfileEditForm;
