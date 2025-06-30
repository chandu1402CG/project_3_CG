// API service for making requests to the backend

const API_URL = 'http://localhost:5000/api';

// Auth services
export const registerUser = async (userData) => {
  try {
    console.log('API Service: Making registration request to:', `${API_URL}/auth/register`);
    
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    
    console.log('API Service: Registration response status:', response.status);
    
    const data = await response.json();
    console.log('API Service: Registration response data:', data);
    
    if (!response.ok) {
      throw new Error(data.message || `Registration failed with status: ${response.status}`);
    }
    
    return data;
  } catch (error) {
    console.error("API Service: Registration error:", error);
    if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
      throw new Error('Could not connect to the server. Please check your connection and try again.');
    }
    throw error;
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Login failed');
    }
    
    return await response.json();
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

// Fetch all users (Admin only)
export const fetchAllUsers = async (adminUserId) => {
  try {
    console.log('API Service: Admin fetching all users');
    
    const response = await fetch(`${API_URL}/auth/all-users?userId=${adminUserId}`);
    
    // Check if response is OK before parsing
    if (!response.ok) {
      // Try to parse error response as JSON, but handle if it's not
      try {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to fetch users with status: ${response.status}`);
      } catch (error) {
        // If can't parse as JSON, return status code
        console.error("Error parsing error response:", error);
        throw new Error(`Failed to fetch users with status: ${response.status}`);
      }
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Fetch all users error:", error);
    throw error;
  }
};

export const updateUserProfile = async (userData) => {
  try {
    console.log('API Service: Updating user profile for ID:', userData.id);
    
    const response = await fetch(`${API_URL}/auth/update-profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    
    // Check if response is OK before parsing
    if (!response.ok) {
      // Try to parse error response as JSON, but handle if it's not
      try {
        const errorData = await response.json();
        throw new Error(errorData.message || `Profile update failed with status: ${response.status}`);
      } catch (error) {
        // If can't parse as JSON, return status code
        console.error("Error parsing error response:", error);
        throw new Error(`Profile update failed with status: ${response.status}`);
      }
    }
    
    // Only try to parse JSON if response is OK
    try {
      const data = await response.json();
      return data;
    } catch (jsonError) {
      console.error("Error parsing JSON response:", jsonError);
      throw new Error("Invalid response format from server");
    }
  } catch (error) {
    console.error("Profile update error:", error);
    throw error;
  }
};

// Add family member or pet
export const updateFamilyMember = async (memberData) => {
  try {
    console.log('API Service: Adding family member or pet for user ID:', memberData.userId);
    
    const response = await fetch(`${API_URL}/auth/add-family-member`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(memberData),
    });
    
    // Check if response is OK before parsing
    if (!response.ok) {
      // Try to parse error response as JSON, but handle if it's not
      try {
        const errorData = await response.json();
        throw new Error(errorData.message || `Family member update failed with status: ${response.status}`);
      } catch (error) {
        // If can't parse as JSON, return status code
        console.error("Error parsing error response:", error);
        throw new Error(`Family member update failed with status: ${response.status}`);
      }
    }
    
    // Only try to parse JSON if response is OK
    try {
      const data = await response.json();
      return data;
    } catch (jsonError) {
      console.error("Error parsing JSON response:", jsonError);
      throw new Error("Invalid response format from server");
    }
  } catch (error) {
    console.error("Family member update error:", error);
    throw error;
  }
};

// Remove family member or pet
export const removeFamilyMember = async (memberData) => {
  try {
    console.log('API Service: Removing family member or pet for user ID:', memberData.userId);
    
    // Use POST instead of DELETE since we need to send a body
    const response = await fetch(`${API_URL}/auth/remove-family-member`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(memberData),
    });
    
    // Check if response is OK before parsing
    if (!response.ok) {
      // Try to parse error response as JSON, but handle if it's not
      try {
        const errorData = await response.json();
        throw new Error(errorData.message || `Family member removal failed with status: ${response.status}`);
      } catch (error) {
        // If can't parse as JSON, return status code
        console.error("Error parsing error response:", error);
        throw new Error(`Family member removal failed with status: ${response.status}`);
      }
    }
    
    // Only try to parse JSON if response is OK
    try {
      const data = await response.json();
      return data;
    } catch (jsonError) {
      console.error("Error parsing JSON response:", jsonError);
      throw new Error("Invalid response format from server");
    }
  } catch (error) {
    console.error("Family member removal error:", error);
    throw error;
  }
};

// Care Centers services
export const fetchCareCenters = async () => {
  try {
    const response = await fetch(`${API_URL}/care-centers`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching care centers:", error);
    throw error;
  }
};

export const fetchCareCenter = async (id) => {
  try {
    const response = await fetch(`${API_URL}/care-centers/${id}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error(`Error fetching care center ${id}:`, error);
    throw error;
  }
};

// Services
export const fetchServices = async () => {
  try {
    const response = await fetch(`${API_URL}/services`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching services:", error);
    throw error;
  }
};

export const fetchService = async (id) => {
  try {
    const response = await fetch(`${API_URL}/services/${id}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error(`Error fetching service ${id}:`, error);
    throw error;
  }
};

// Original item services
export const fetchItems = async () => {
  try {
    const response = await fetch(`${API_URL}/items`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching items:", error);
    throw error;
  }
};

export const fetchItemById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/items/${id}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error(`Error fetching item ${id}:`, error);
    throw error;
  }
};

export const createItem = async (itemData) => {
  try {
    const response = await fetch(`${API_URL}/items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(itemData),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error creating item:", error);
    throw error;
  }
};

export const updateItem = async (id, itemData) => {
  try {
    const response = await fetch(`${API_URL}/items/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(itemData),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error(`Error updating item ${id}:`, error);
    throw error;
  }
};

export const deleteItem = async (id) => {
  try {
    const response = await fetch(`${API_URL}/items/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.message;
  } catch (error) {
    console.error(`Error deleting item ${id}:`, error);
    throw error;
  }
};

// Admin: Update user profile
export const adminUpdateUser = async (adminId, targetUserId, userData) => {
  try {
    console.log('API Service: Admin updating user profile for user ID:', targetUserId);
    
    const response = await fetch(`${API_URL}/auth/admin-update-user`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        adminId,
        targetUserId,
        userData
      }),
    });
    
    // Check if response is OK before parsing
    if (!response.ok) {
      // Try to parse error response as JSON, but handle if it's not
      try {
        const errorData = await response.json();
        throw new Error(errorData.message || `Admin profile update failed with status: ${response.status}`);
      } catch (error) {
        // If can't parse as JSON, return status code
        console.error("Error parsing error response:", error);
        throw new Error(`Admin profile update failed with status: ${response.status}`);
      }
    }
    
    // Only try to parse JSON if response is OK
    try {
      const data = await response.json();
      return data;
    } catch (jsonError) {
      console.error("Error parsing JSON response:", jsonError);
      throw new Error("Invalid response format from server");
    }
  } catch (error) {
    console.error("Admin profile update error:", error);
    throw error;
  }
};

// Admin: Add family member or pet to any user
export const adminAddFamilyMember = async (adminId, targetUserId, memberData) => {
  try {
    console.log('API Service: Admin adding family member for user ID:', targetUserId);
    
    const response = await fetch(`${API_URL}/auth/admin-add-family-member`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        adminId,
        targetUserId,
        memberData
      }),
    });
    
    // Check if response is OK before parsing
    if (!response.ok) {
      // Try to parse error response as JSON, but handle if it's not
      try {
        const errorData = await response.json();
        throw new Error(errorData.message || `Admin add family member failed with status: ${response.status}`);
      } catch (error) {
        // If can't parse as JSON, return status code
        console.error("Error parsing error response:", error);
        throw new Error(`Admin add family member failed with status: ${response.status}`);
      }
    }
    
    // Only try to parse JSON if response is OK
    try {
      const data = await response.json();
      return data;
    } catch (jsonError) {
      console.error("Error parsing JSON response:", jsonError);
      throw new Error("Invalid response format from server");
    }
  } catch (error) {
    console.error("Admin add family member error:", error);
    throw error;
  }
};

// Admin: Remove family member or pet from any user
export const adminRemoveFamilyMember = async (adminId, targetUserId, memberId, memberType) => {
  try {
    console.log('API Service: Admin removing family member for user ID:', targetUserId);
    
    const response = await fetch(`${API_URL}/auth/admin-remove-family-member`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        adminId,
        targetUserId,
        memberId,
        memberType
      }),
    });
    
    // Check if response is OK before parsing
    if (!response.ok) {
      // Try to parse error response as JSON, but handle if it's not
      try {
        const errorData = await response.json();
        throw new Error(errorData.message || `Admin remove family member failed with status: ${response.status}`);
      } catch (error) {
        // If can't parse as JSON, return status code
        console.error("Error parsing error response:", error);
        throw new Error(`Admin remove family member failed with status: ${response.status}`);
      }
    }
    
    // Only try to parse JSON if response is OK
    try {
      const data = await response.json();
      return data;
    } catch (jsonError) {
      console.error("Error parsing JSON response:", jsonError);
      throw new Error("Invalid response format from server");
    }
  } catch (error) {
    console.error("Admin remove family member error:", error);
    throw error;
  }
};

// Fetch testimonials
export const fetchTestimonials = async () => {
  try {
    console.log('API Service: Fetching testimonials from', `${API_URL}/testimonials`);
    
    const response = await fetch(`${API_URL}/testimonials`);
    console.log('Testimonials API response status:', response.status);
    
    if (!response.ok) {
      console.error('Response not OK:', response.status, response.statusText);
      let errorMessage;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message;
      } catch (e) {
        errorMessage = `Failed to fetch testimonials with status: ${response.status}`;
      }
      throw new Error(errorMessage);
    }
    
    const data = await response.json();
    console.log('Testimonials API response data:', data);
    return data.data || [];
  } catch (error) {
    console.error("Fetch testimonials error:", error);
    throw error;
  }
};

// Submit a new testimonial
export const submitTestimonial = async (testimonialData) => {
  try {
    console.log('API Service: Submitting testimonial to', `${API_URL}/testimonials`, testimonialData);
    
    const response = await fetch(`${API_URL}/testimonials`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testimonialData),
    });
    
    console.log('Testimonial submission response status:', response.status);
    
    if (!response.ok) {
      console.error('Response not OK:', response.status, response.statusText);
      let errorMessage;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message;
      } catch (_) {
        errorMessage = `Failed to submit testimonial with status: ${response.status}`;
      }
      throw new Error(errorMessage);
    }
    
    const data = await response.json();
    console.log('Testimonial submission response data:', data);
    return data.data;
  } catch (error) {
    console.error("Submit testimonial error:", error);
    throw error;
  }
};

// Delete a user (Admin only)
export const deleteUser = async (userId, adminUserId) => {
  try {
    console.log('API Service: Admin deleting user:', userId);
    
    const response = await fetch(`${API_URL}/auth/delete-user/${userId}?adminId=${adminUserId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    // Check if response is OK before parsing
    if (!response.ok) {
      // Try to parse error response as JSON, but handle if it's not
      try {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to delete user with status: ${response.status}`);
      } catch (error) {
        // If can't parse as JSON, return status code
        console.error("Error parsing error response:", error);
        throw new Error(`Failed to delete user with status: ${response.status}`);
      }
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Delete user error:", error);
    throw error;
  }
};

// Forgot password - Step 1: Request password reset
export const forgotPassword = async (email) => {
  try {
    console.log('API Service: Requesting password reset for email:', email);
    
    const response = await fetch(`${API_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Password reset request failed with status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Password reset request error:", error);
    throw error;
  }
};

// Forgot password - Step 2: Verify reset code (math puzzle answer)
export const verifyResetCode = async (email, answer, resetToken) => {
  try {
    console.log('API Service: Verifying reset code for email:', email);
    
    const response = await fetch(`${API_URL}/auth/verify-reset`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, answer, resetToken }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Reset verification failed with status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Reset verification error:", error);
    throw error;
  }
};

// Forgot password - Step 3: Reset password with new password
export const resetPassword = async (email, newPassword, resetToken) => {
  try {
    console.log('API Service: Resetting password for email:', email);
    
    const response = await fetch(`${API_URL}/auth/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, newPassword, resetToken }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Password reset failed with status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Password reset error:", error);
    throw error;
  }
};

// Schedule services
// Create a new schedule
export const createSchedule = async (scheduleData) => {
  try {
    console.log('API Service: Creating new schedule for user:', scheduleData.userId);
    
    const response = await fetch(`${API_URL}/schedules`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(scheduleData),
    });
    
    if (!response.ok) {
      let errorMessage;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message;
      } catch {
        errorMessage = `Failed to create schedule with status: ${response.status}`;
      }
      throw new Error(errorMessage);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Create schedule error:", error);
    throw error;
  }
};

// Fetch user's schedules
export const fetchUserSchedules = async (userId) => {
  try {
    console.log('API Service: Fetching schedules for user:', userId);
    
    const response = await fetch(`${API_URL}/schedules/${userId}`);
    
    if (!response.ok) {
      let errorMessage;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message;
      } catch {
        errorMessage = `Failed to fetch schedules with status: ${response.status}`;
      }
      throw new Error(errorMessage);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Fetch schedules error:", error);
    throw error;
  }
};
