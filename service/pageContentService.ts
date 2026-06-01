import axiosInstance from './api';

export interface PageContentResponse {
  data: {
    content_en: string;
    content_ar: string;
    title_en?: string;
    title_ar?: string;
    lastUpdated?: string;
  };
  success: boolean;
  message: string;
}

/**
 * Fetches page content from the API
 * @param pageType The type of page content to fetch (e.g., 'privacy-policy', 'terms')
 * @returns Promise with the page content response containing both English and Arabic content
 */
export const fetchPageContent = async (pageType: string): Promise<PageContentResponse> => {
  try {
    const response = await axiosInstance.get<PageContentResponse>(`/1.0/page-content/${pageType}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${pageType} content:`, error);
    throw error;
  }
};
