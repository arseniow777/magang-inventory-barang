// Get API base URL from environment or default to localhost:5000
export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

export const getImageUrl = (filePath: string): string => {
  return `${API_BASE_URL}${filePath}`;
};
