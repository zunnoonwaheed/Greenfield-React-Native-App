import axiosInstance, { setUserData } from './axiosConfig';

/**
 * Update Profile
 * POST /api/update-profile.php
 */
export const updateProfile = async (profileData) => {
  try {
    console.log('👤 Updating profile:', profileData);

    const formData = new URLSearchParams();
    if (profileData.name) formData.append('name', profileData.name);
    if (profileData.phone) formData.append('phone', profileData.phone);
    if (profileData.email) formData.append('email', profileData.email);
    if (profileData.address) formData.append('address', profileData.address);

    const response = await axiosInstance.post('/api/update-profile.php', formData.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    console.log('✅ Profile updated successfully');

    if (response.success && response.data && response.data.user) {
      await setUserData(response.data.user);
    }

    return response;
  } catch (error) {
    console.error('❌ Error updating profile:', error);
    throw error;
  }
};

export default updateProfile;
