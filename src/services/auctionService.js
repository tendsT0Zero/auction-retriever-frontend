import { apiRequest } from "./apiClient";

/**
 * Get all auctions with optional filters
 * @param {Object} filters - Filter parameters
 * @param {string} filters.state - State code (e.g., "CA")
 * @param {string} filters.city - City name
 * @param {string} filters.country - Country name
 * @param {string} filters.type - Property type (e.g., "Land")
 * @param {string} filters.keyword - Search keyword
 * @param {number} filters.bid_min - Minimum bid
 * @param {number} filters.bid_max - Maximum bid
 * @param {string} filters.auction_date_from - Start date
 * @param {string} filters.auction_date_to - End date
 * @param {string} filters.sort_by - Sort field (e.g., "scraped_at")
 * @param {string} filters.sort_dir - Sort direction ("asc" or "desc")
 * @param {number} filters.per_page - Items per page
 * @param {number} filters.current_page - Page number
 * @param {string} token - Authentication token
 * @returns {Promise<Object>} - Auctions data with pagination
 */
export async function getAuctions(filters = {}, token) {
  const queryParams = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== "") {
      queryParams.append(key, value);
    }
  });

  const queryString = queryParams.toString();
  const url = queryString ? `/auction?${queryString}` : "/auction";

  return apiRequest(url, {
    method: "GET",
    token,
  });
}

/**
 * Get available filter options (states, cities, property types, etc.)
 * @param {string} token - Authentication token
 * @returns {Promise<Object>} - Filter options data
 */
export async function getFilterOptions(token) {
  return apiRequest("/auction/filter-options", {
    method: "GET",
    token,
  });
}

/**
 * Save an auction to favorites
 * @param {number} auctionId - Auction ID
 * @param {string} token - Authentication token
 * @returns {Promise<Object>} - Response from API
 */
export async function saveAuction(auctionId, token) {
  return apiRequest(`/auction/${auctionId}/save`, {
    method: "POST",
    token,
  });
}

/**
 * Get saved auctions
 * @param {string} token - Authentication token
 * @param {Object} params - Optional query params
 * @returns {Promise<Object>} - Saved auctions data
 */
export async function getSavedAuctions(token, params = {}) {
  const queryParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== "") {
      queryParams.append(key, value);
    }
  });

  const queryString = queryParams.toString();
  const url = queryString ? `/auction/saved?${queryString}` : "/auction/saved";

  return apiRequest(url, {
    method: "GET",
    token,
  });
}

/**
 * Get auction details
 * @param {number} auctionId - Auction ID
 * @param {string} token - Authentication token
 * @returns {Promise<Object>} - Auction details
 */
export async function getAuctionDetails(auctionId, token) {
  return apiRequest(`/auction/${auctionId}/view`, {
    method: "GET",
    token,
  });
}

/**
 * Get random auctions for the home page
 * @returns {Promise<Object>} - Random auctions data
 */
export async function getHomeRandomAuctions() {
  return apiRequest("/home/random/auction", {
    method: "GET",
  });
}
