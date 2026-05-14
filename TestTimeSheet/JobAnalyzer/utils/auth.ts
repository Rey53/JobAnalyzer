
// Authentication utility functions

/**
 * Check if user is currently authenticated
 */
export const isAuthenticated = (): boolean => {
    const token = sessionStorage.getItem('pharma_auth_token');
    const timestamp = sessionStorage.getItem('pharma_auth_timestamp');
    
    if (!token || !timestamp) {
        return false;
    }
    
    // Check if session is still valid (8 hours max)
    const sessionAge = Date.now() - parseInt(timestamp);
    const EIGHT_HOURS = 8 * 60 * 60 * 1000;
    
    if (sessionAge > EIGHT_HOURS) {
        logout();
        return false;
    }
    
    return true;
};

/**
 * Get current authenticated user
 */
export const getCurrentUser = (): string | null => {
    return sessionStorage.getItem('pharma_auth_user');
};

/**
 * Logout user and clear session
 */
export const logout = (): void => {
    sessionStorage.removeItem('pharma_auth_token');
    sessionStorage.removeItem('pharma_auth_user');
    sessionStorage.removeItem('pharma_auth_timestamp');
    
    // Force reload to clear any cached data
    window.location.reload();
};

/**
 * Security check - prevent direct access via URL manipulation
 */
export const enforceAuthentication = (): void => {
    if (!isAuthenticated()) {
        // Clear any potentially cached data
        sessionStorage.clear();
        localStorage.clear();
    }
};
