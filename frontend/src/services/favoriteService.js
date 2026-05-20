import apiClient from "../lib/apiClient.js";

class FavoriteService {
  // Add to favorites
  async addFavorite(_userId, productId) {
    try {
      const response = await apiClient.post(`/favorites/${productId}`); // FIX: Remove duplicate /favorites
      return response.data?.data;
    } catch (error) {
      console.error("Error adding favorite:", error);
      throw error;
    }
  }

  // Remove from favorites
  async removeFavorite(_userId, productId) {
    try {
      await apiClient.delete(`/favorites/${productId}`); // FIX: Remove duplicate /favorites
      return true;
    } catch (error) {
      console.error("Error removing favorite:", error);
      throw error;
    }
  }

  // Get user favorites
  async getUserFavorites() {
    try {
      const response = await apiClient.get('/favorites');
      const docs = response.data?.data || [];
      return {
        documents: docs.map(fav => ({ ...fav, productId: String(fav.id), $id: String(fav.id) }))
      };
    } catch (error) {
      console.error("Error getting favorites:", error);
      throw error;
    }
  }

  // Check if product is favorited
  async isFavorited(_userId, productId) {
    try {
      const favs = await this.getUserFavorites();
      return favs.documents.some(doc => String(doc.id) === String(productId) || String(doc.productId) === String(productId));
    } catch (error) {
      console.error("Error checking favorite:", error);
      return false;
    }
  }

}

export default new FavoriteService();
