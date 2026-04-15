import { apiRequest } from "./apiClient";

/**
 * Get current user profile information
 * @param {string} token - Authentication token
 * @returns {Promise<Object>} - User profile data
 */
export async function getUserProfile(token) {
  return apiRequest("/me", {
    method: "GET",
    token,
  });
}

// update profile
export async function updateProfile(profileData, token) {
  const formData = new FormData();
  Object.entries(profileData).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      formData.append(key, value);
    }
  });

  return apiRequest("/update-profile", {
    method: "POST",
    body: formData,
    token,
  });
}

// change password
export async function changePassword(currentPassword, newPassword, token) {
  const formData = new FormData();
  formData.append("current_password", currentPassword);
  formData.append("new_password", newPassword);
  formData.append("new_password_confirmation", newPassword);

  return apiRequest("/change-password", {
    method: "POST",
    body: formData,
    token,
  });
}

// update avatar
export async function updateAvatar(avatarFile, token) {
  const formData = new FormData();
  formData.append("avatar", avatarFile);

  return apiRequest("/update-avatar", {
    method: "POST",
    body: formData,
    token,
  });
}

// delete profile
export async function deleteProfile(token) {
  return apiRequest("/delete-profile", {
    method: "DELETE",
    token,
  });
}
