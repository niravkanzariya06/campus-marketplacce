import apiClient from "../lib/apiClient.js";

class ReportService {
  // Submit a product report (authenticated users)
  async submitReport(reportData) {
    try {
      const response = await apiClient.post("/reports", reportData);
      return response.data?.data || response.data;
    } catch (error) {
      console.error("Error submitting report:", error);
      throw error;
    }
  }

  // Get all reports (admin only)
  async getReports(params = {}) {
    try {
      const { status } = params;
      const response = await apiClient.get("/reports", {
        params: status ? { status } : {}
      });
      return response.data?.data || [];
    } catch (error) {
      console.error("Error fetching reports:", error);
      throw error;
    }
  }

  // Update report status (admin only)
  async updateReportStatus(reportId, status) {
    try {
      const response = await apiClient.patch(`/reports/${reportId}`, { status });
      return response.data?.data || response.data;
    } catch (error) {
      console.error("Error updating report status:", error);
      throw error;
    }
  }
}

export default new ReportService();
