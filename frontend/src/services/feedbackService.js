import apiClient from "../lib/apiClient.js";

class FeedbackService {
  // Submit feedback
  async submitFeedback(feedbackData) {
    try {
      const response = await apiClient.post("/feedback", feedbackData);
      return response.data?.data || response.data;
    } catch (error) {
      console.error("Error submitting feedback:", error);
      throw error;
    }
  }

  // Get all feedback with pagination
  async getFeedback(params = {}) {
    try {
      const { status, sortBy = 'newest', search = '', page = 1, limit = 6 } = params;
      const response = await apiClient.get("/feedback", {
        params: { status, sortBy, search, page, limit }
      });
      const data = response.data?.data || {};
      return {
        documents: (data.documents || []).map(fb => ({
          id: fb.id,
          // Snake_case (from SQL / API & admin)
          full_name: fb.full_name || fb.fullName || '',
          email: fb.email || '',
          rating: fb.rating || 0,
          message: fb.message || '',
          status: fb.status || 'new',
          created_at: fb.created_at || fb.createdAt,
          // CamelCase (for FeedbackPage & testimonials)
          fullName: fb.full_name || fb.fullName || '',
          createdAt: fb.created_at || fb.createdAt,
          feedbackId: String(fb.id),
          $id: String(fb.id)
        })),
        pagination: data.pagination || { total: 0, page: 1, limit: 6, totalPages: 0 }
      };
    } catch (error) {
      console.error("Error fetching feedback:", error);
      throw error;
    }
  }

  // Update feedback status (mark as reviewed)
  async updateFeedbackStatus(feedbackId, status) {
    try {
      const response = await apiClient.patch(`/feedback/${feedbackId}`, { status });
      return response.data?.data || response.data;
    } catch (error) {
      console.error("Error updating feedback status:", error);
      throw error;
    }
  }

  // Delete feedback
  async deleteFeedback(feedbackId) {
    try {
      const response = await apiClient.delete(`/feedback/${feedbackId}`);
      return response.data?.data || response.data;
    } catch (error) {
      console.error("Error deleting feedback:", error);
      throw error;
    }
  }
}

export default new FeedbackService();
