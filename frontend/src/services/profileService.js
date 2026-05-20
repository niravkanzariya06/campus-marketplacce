import apiClient from "../lib/apiClient.js";

export class ProfileService {
    // ---------------------------
    // UPLOAD PROFILE PHOTO
    // ---------------------------
    async uploadProfilePhoto(_userId, file) {
        try {
            const formData = new FormData();
            formData.append("avatar", file);

            const response = await apiClient.patch('/users/change-avatar', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return response.data?.data;
        } catch (error) {
            console.log("ProfileService :: uploadProfilePhoto :: error", error);
            return null;
        }
    }

    // ---------------------------
    // DELETE PROFILE PHOTO
    // ---------------------------
    async deleteProfilePhoto() {
        // Not explicitly supported in backend right now (unless we set avatar logic to null)
        return true;
    }

    // ---------------------------
    // GET PROFILE PHOTO URL
    // ---------------------------
    getProfilePhoto(avatarUrl) {
        // Backend saves Cloudinary full URLs in user.avatar. 
        // We just pass the value through since components pass user.avatar to this function thinking it's an ID
        return avatarUrl;
    }

    // ---------------------------
    // UPDATE NAME
    // ---------------------------
    async updateName(name) {
        try {
            const response = await apiClient.patch('/users/profile', {
                username: name, // Using the backend parameter 'username'
            });
            return response.data?.data;
        } catch (error) {
            console.log("ProfileService :: updateName :: error", error);
            return null;
        }
    }
}

const profileService = new ProfileService();
export default profileService;
