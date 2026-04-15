import { useState, useEffect } from "react";
import { AUTH_USER_UPDATED_EVENT, authStorage } from "../services/authService";
import { getUserProfile } from "../services/profileService";

/**
 * Custom hook to fetch and manage user profile data
 * @returns {Object} - { user, loading, error }
 */
export function useUserProfile() {
  const [user, setUser] = useState(() => authStorage.getUser());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = authStorage.getToken();

        if (!token) {
          setUser(null);
          setLoading(false);
          return;
        }

        const response = await getUserProfile(token);

        if (response.status || response.success) {
          const nextUser = response.data || response;
          setUser(nextUser);
          authStorage.setUser(nextUser);
        } else {
          setError(response.message || "Failed to fetch user profile");
          setUser(null);
        }
      } catch (err) {
        setError(err.message || "Error fetching user profile");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const handleUserUpdated = (event) => {
      const nextUser = event?.detail ?? authStorage.getUser();
      setUser(nextUser || null);
    };

    const handleStorage = (event) => {
      if (event.key && event.key !== "auth_user") {
        return;
      }
      setUser(authStorage.getUser());
    };

    window.addEventListener(AUTH_USER_UPDATED_EVENT, handleUserUpdated);
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener(AUTH_USER_UPDATED_EVENT, handleUserUpdated);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  return { user, loading, error };
}
