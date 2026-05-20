import apiClient from '../lib/apiClient.js';

export class AuthService {
    constructor() {
        this.pendingRequests = new Map();
    }

    /**
     * Prevent duplicate simultaneous requests - FIXES RACE CONDITION
     */
    async createAccount({ email, password, name }) {
        const key = `register_${email}`;

        // Return existing request if already in progress
        if (this.pendingRequests.has(key)) {
            return this.pendingRequests.get(key);
        }

        const promise = (async () => {
            try {
                const response = await apiClient.post('/auth/register', {
                    email,
                    password,
                    username: name,
                });
                // Return response directly - don't auto-login (prevents double request)
                return response.data;
            } catch (error) {
                throw error.response?.data?.message || "Registration failed";
            } finally {
                this.pendingRequests.delete(key);
            }
        })();

        this.pendingRequests.set(key, promise);
        return promise;
    }

    /**
     * Idempotent login - FIXES RACE CONDITION
     * Same email + password within short window = same response
     */
    async login({ email, password }) {
        const key = `login_${email}`;

        // Return existing request if already in progress
        if (this.pendingRequests.has(key)) {
            return this.pendingRequests.get(key);
        }

        const promise = (async () => {
            try {
                const response = await apiClient.post('/auth/login', { email, password });
                return response.data;
            } catch (error) {
                throw error.response?.data?.message || "Login failed";
            } finally {
                this.pendingRequests.delete(key);
            }
        })();

        this.pendingRequests.set(key, promise);
        return promise;
    }

    async getCurrentUser() {
        try {
            const response = await apiClient.get('/users/me');
            if (response.data && response.data.data) {
                const u = response.data.data;
                return { ...u, $id: String(u.id), name: u.username };
            }
            return null;
        } catch {
            return null;
        }
    }

    async logout() {
        try {
            // Clear pending requests on logout
            this.pendingRequests.clear();
            await apiClient.post('/auth/logout');
        } catch (error) {
            console.log("AuthService :: logout :: error", error);
        }
    }

    /**
     * Clear any pending requests (e.g., on navigation or error recovery)
     */
    clearPendingRequests() {
        this.pendingRequests.clear();
    }

    async verifyEmail(token) {
        try {
            const response = await apiClient.get(`/auth/verify-email/${token}`);
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || "Email verification failed";
        }
    }

    async forgotPassword(email) {
        try {
            const response = await apiClient.post('/auth/forgot-password', { email });
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || "Failed to send OTP. Please try again.";
        }
    }

    async verifyOtp(email, otp) {
        try {
            const response = await apiClient.post('/auth/verify-otp', { email, otp });
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || "OTP verification failed. Please try again.";
        }
    }

    async resetPassword(resetToken, password, confirmPassword) {
        try {
            const response = await apiClient.post('/auth/reset-password', {
                resetToken,
                password,
                confirmPassword
            });
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || "Password reset failed. Please try again.";
        }
    }

    async resendVerificationEmail(email) {
        try {
            const response = await apiClient.post('/auth/resend-verification', { email });
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || "Failed to resend verification email";
        }
    }
}

const authService = new AuthService();

export default authService;
