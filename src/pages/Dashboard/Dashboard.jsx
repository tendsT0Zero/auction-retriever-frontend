import React, { useCallback, useEffect, useMemo, useState } from "react";
import DashboardHeader from "../../shared/DashboardHeader";
import WelcomeSection from "../../components/dashboard/WelcomeSection";
import DashboardFilters from "../../components/dashboard/DashboardFilters";
import PropertySection from "../../components/dashboard/PropertySection";
import AiChatBot from "../../components/dashboard/AiChatBot";
import TrialUpsellBanner from "../../components/common/TrialUpsellBanner";
import SpinnerLoader from "../../components/common/SpinnerLoader";
import { authStorage } from "../../services/authService";
import { getSubscriptionStatus } from "../../services/subscriptionService";
import {
  getAuctions,
  getFilterOptions,
  saveAuction,
} from "../../services/auctionService";
import { extractSubscriptionAccess } from "../../utils/subscriptionStatus";

function Dashboard() {
  const [auctions, setAuctions] = useState([]);
  const [filterOptions, setFilterOptions] = useState({
    states: [],
    counties: [],
    types: [],
    bidRange: {
      min: 0,
      max: 0,
    },
  });
  const [filters, setFilters] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [subscription, setSubscription] = useState({
    isLoading: true,
    isActive: false,
    status: "",
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    perPage: 12,
    totalPages: 1,
    totalItems: 0,
  });
  const [appliedFilters, setAppliedFilters] = useState({});

  const normalizeFilterList = (list) => {
    if (!Array.isArray(list)) return [];
    const seen = new Set();
    return list.reduce((acc, item) => {
      const value = String(item || "").trim();
      if (!value) return acc;
      if (value.toLowerCase() === "all") return acc;
      if (seen.has(value)) return acc;
      seen.add(value);
      acc.push(value);
      return acc;
    }, []);
  };

  const normalizeBidRange = (range) => {
    const rawMin = Number(range?.min);
    const rawMax = Number(range?.max);
    let min = Number.isFinite(rawMin) ? Math.floor(rawMin) : 0;
    let max = Number.isFinite(rawMax) ? Math.ceil(rawMax) : 0;

    if (min < 0) min = 0;
    if (max < min) {
      const swap = min;
      min = max;
      max = swap;
    }

    return {
      min,
      max,
    };
  };

  const extractPaginatedList = (payload) => {
    const data = payload?.data ?? payload;
    const hasPaginationFields = (value) =>
      value &&
      typeof value === "object" &&
      (value.current_page !== undefined ||
        value.currentPage !== undefined ||
        value.per_page !== undefined ||
        value.perPage !== undefined ||
        value.page_size !== undefined ||
        value.total !== undefined ||
        value.total_items !== undefined ||
        value.totalItems !== undefined ||
        value.total_count !== undefined ||
        value.totalCount !== undefined ||
        value.last_page !== undefined ||
        value.lastPage !== undefined ||
        value.total_pages !== undefined ||
        value.totalPages !== undefined);
    const meta =
      data?.meta ||
      data?.pagination ||
      (hasPaginationFields(data) ? data : null) ||
      payload?.meta ||
      payload?.pagination ||
      (hasPaginationFields(payload) ? payload : null) ||
      {};
    let list = [];

    if (Array.isArray(data)) {
      list = data;
    } else if (Array.isArray(data?.data)) {
      list = data.data;
    } else if (Array.isArray(data?.items)) {
      list = data.items;
    }

    return { list, meta };
  };

  const buildPaginationState = (meta, fallback) => {
    const rawPerPage =
      meta?.per_page ??
      meta?.perPage ??
      meta?.page_size ??
      meta?.pageSize ??
      fallback.perPage;
    const rawCurrent =
      meta?.current_page ??
      meta?.currentPage ??
      meta?.page ??
      fallback.currentPage;
    const rawTotal =
      meta?.total ??
      meta?.total_items ??
      meta?.totalItems ??
      meta?.total_count ??
      meta?.totalCount ??
      0;
    const rawLast =
      meta?.last_page ??
      meta?.total_pages ??
      meta?.lastPage ??
      meta?.totalPages;

    const perPage = Number.isFinite(Number(rawPerPage))
      ? Number(rawPerPage)
      : fallback.perPage;
    const currentPage = Number.isFinite(Number(rawCurrent))
      ? Number(rawCurrent)
      : fallback.currentPage;
    const totalItems = Number.isFinite(Number(rawTotal)) ? Number(rawTotal) : 0;
    let totalPages = Number.isFinite(Number(rawLast)) ? Number(rawLast) : 0;

    if (!totalPages && perPage > 0) {
      totalPages = Math.max(1, Math.ceil(totalItems / perPage));
    }

    return {
      currentPage,
      perPage,
      totalPages: totalPages || 1,
      totalItems,
    };
  };

  const buildPageList = (currentPage, totalPages, maxButtons = 5) => {
    if (totalPages <= 1) return [1];
    const half = Math.floor(maxButtons / 2);
    let start = Math.max(1, currentPage - half);
    let end = Math.min(totalPages, start + maxButtons - 1);

    if (end - start + 1 < maxButtons) {
      start = Math.max(1, end - maxButtons + 1);
    }

    const pages = [];
    for (let page = start; page <= end; page += 1) {
      pages.push(page);
    }
    return pages;
  };

  const fetchAuctions = useCallback(
    async (filtersToApply, pageNumber, tokenOverride) => {
      const token = tokenOverride || authStorage.getToken();

      if (!token) {
        setError("Please login to view auctions");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const perPage = pagination.perPage || 10;
        const response = await getAuctions(
          {
            ...filtersToApply,
            per_page: perPage,
            current_page: pageNumber,
          },
          token,
        );

        if (response.status || response.success) {
          const { list, meta } = extractPaginatedList(response);
          setAuctions(list);
          setPagination(
            buildPaginationState(meta, {
              currentPage: pageNumber,
              perPage,
            }),
          );
        } else {
          setError(response.message || "Failed to fetch auctions");
          setAuctions([]);
        }
      } catch (err) {
        setError(err.message || "Error fetching data");
        console.error("Error fetching dashboard data:", err);
        setAuctions([]);
      } finally {
        setLoading(false);
      }
    },
    [pagination.perPage],
  );

  useEffect(() => {
    let ignore = false;

    const fetchData = async () => {
      const token = authStorage.getToken();

      if (!token) {
        if (!ignore) {
          setError("Please login to view auctions");
          setLoading(false);
          setSubscription({
            isLoading: false,
            isActive: false,
            status: "",
          });
        }
        return;
      }

      try {
        setLoading(true);
        setError(null);
        setSubscription((prev) => ({ ...prev, isLoading: true }));

        let access = {
          isActive: false,
          status: "",
        };

        try {
          const statusResponse = await getSubscriptionStatus(token);
          access = extractSubscriptionAccess(statusResponse);
        } catch (subscriptionError) {
          if (!ignore) {
            setSubscription({
              isLoading: false,
              isActive: false,
              status: "",
            });
            setError(
              subscriptionError.message ||
                "Unable to verify subscription status",
            );
            setAuctions([]);
            setFilterOptions({
              states: [],
              counties: [],
              types: [],
              bidRange: { min: 0, max: 0 },
            });
          }
          return;
        }

        if (ignore) {
          return;
        }

        setSubscription({
          isLoading: false,
          isActive: access.isActive,
          status: access.status,
        });

        if (!access.isActive) {
          setAuctions([]);
          setFilterOptions({
            states: [],
            counties: [],
            types: [],
            bidRange: { min: 0, max: 0 },
          });
          return;
        }

        // Fetch filter options
        try {
          const optionsResponse = await getFilterOptions(token);
          if (optionsResponse.status || optionsResponse.success) {
            const data = optionsResponse.data || optionsResponse;
            setFilterOptions({
              states: normalizeFilterList(data.states),
              counties: normalizeFilterList(data.counties || data.cities || []),
              types: normalizeFilterList(data.types),
              bidRange: normalizeBidRange(data.bid_range),
            });
          } else {
            console.warn(
              "Failed to fetch filter options:",
              optionsResponse.message,
            );
            setFilterOptions({
              states: [],
              counties: [],
              types: [],
              bidRange: { min: 0, max: 0 },
            });
          }
        } catch (filterErr) {
          console.warn("Error fetching filter options:", filterErr);
          setFilterOptions({
            states: [],
            counties: [],
            types: [],
            bidRange: { min: 0, max: 0 },
          });
        }

        await fetchAuctions({}, 1, token);
      } catch (err) {
        if (!ignore) {
          setError(err.message || "Error fetching data");
          console.error("Error fetching dashboard data:", err);
          setAuctions([]);
          setFilterOptions({
            states: [],
            counties: [],
            types: [],
            bidRange: { min: 0, max: 0 },
          });
        }
      } finally {
        if (!ignore) {
          setLoading(false);
          setSubscription((prev) => ({ ...prev, isLoading: false }));
        }
      }
    };

    fetchData();

    return () => {
      ignore = true;
    };
  }, [fetchAuctions]);

  // Apply filters
  const handleApplyFilters = useCallback(
    async (filterParams) => {
      if (!subscription.isActive) {
        return;
      }

      try {
        const token = authStorage.getToken();

        if (!token) {
          setError("Please login to apply filters");
          return;
        }

        // Convert filter object to backend parameter
        const backendFilters = {};

        if (filterParams.search) {
          backendFilters.keyword = filterParams.search;
        }
        if (filterParams.state) {
          backendFilters.state = filterParams.state;
        }
        if (filterParams.county) {
          backendFilters.county = filterParams.county;
        }
        if (filterParams.propertyType) {
          backendFilters.type = filterParams.propertyType;
        }
        if (filterParams.bidMin || filterParams.bidMax) {
          const minLimit = Number(filterOptions.bidRange?.min);
          const maxLimit = Number(filterOptions.bidRange?.max);
          const hasMinLimit = Number.isFinite(minLimit);
          const hasMaxLimit = Number.isFinite(maxLimit) && maxLimit > 0;

          if (
            Number.isFinite(filterParams.bidMin) &&
            (!hasMinLimit || filterParams.bidMin > minLimit)
          ) {
            backendFilters.bid_min = filterParams.bidMin;
          }
          if (
            Number.isFinite(filterParams.bidMax) &&
            (!hasMaxLimit || filterParams.bidMax < maxLimit)
          ) {
            backendFilters.bid_max = filterParams.bidMax;
          }
        }
        if (filterParams.range?.start) {
          backendFilters.auction_date_from = filterParams.range.start
            .toISOString()
            .split("T")[0];
        }
        if (filterParams.range?.end) {
          backendFilters.auction_date_to = filterParams.range.end
            .toISOString()
            .split("T")[0];
        }

        setAppliedFilters(backendFilters);
        setFilters(filterParams);
        await fetchAuctions(backendFilters, 1, token);
      } catch (err) {
        setError(err.message || "Error applying filters");
        console.error("Error applying filters:", err);
      } finally {
        setLoading(false);
      }
    },
    [fetchAuctions, filterOptions.bidRange, subscription.isActive],
  );

  // Format auction type
  const formatType = (type) => {
    if (!type) return "Property";
    return type
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  // Extract address from title
  const extractAddress = (title) => {
    if (!title) return "";
    return title.split(" - ")[0].trim();
  };

  // Format auctions data to match PropertySection component structure
  const formattedAuctions = useMemo(() => {
    return auctions.map((auction) => ({
      id: auction.id,
      tag: formatType(auction.type),
      image:
        (auction.image_url && auction.image_url.trim()) ||
        (auction.image && auction.image.trim()) ||
        "./public/property-images/propertyimage1.png",
      price: auction.bid_amount
        ? `$${Number(auction.bid_amount).toLocaleString()}`
        : "$0",
      address: extractAddress(auction.title) || "",
      location: `${auction.county || ""}, ${auction.state || ""}`.trim(),
      date: auction.auction_date
        ? new Date(auction.auction_date).toLocaleDateString()
        : new Date().toLocaleDateString(),
      source: auction.source_name || "Unknown",
      isFavourite: auction.is_saved || false,
    }));
  }, [auctions]);

  const handleToggleFavourite = async (property, nextValue) => {
    if (!subscription.isActive) {
      setError("Start your 7-days free trial to save listings");
      return false;
    }

    try {
      const token = authStorage.getToken();

      if (!token) {
        setError("Please login to save listings");
        return false;
      }

      const response = await saveAuction(property.id, token);

      if (response.status || response.success) {
        setAuctions((prev) =>
          prev.map((auction) =>
            auction.id === property.id
              ? { ...auction, is_saved: nextValue }
              : auction,
          ),
        );
        return nextValue;
      }

      setError(response.message || "Failed to update saved listing");
      return !nextValue;
    } catch (err) {
      setError(err.message || "Failed to update saved listing");
      return !nextValue;
    }
  };

  const handlePageChange = (nextPage) => {
    if (loading) return;
    if (nextPage < 1 || nextPage > pagination.totalPages) return;
    if (nextPage === pagination.currentPage) return;
    fetchAuctions(appliedFilters, nextPage);
  };

  const pageList = buildPageList(pagination.currentPage, pagination.totalPages);

  if (subscription.isLoading) {
    return (
      <div className="bg-gradient-to-br from-zinc-100 via-amber-50 to-amber-200 pb-6">
        <div className="container mx-auto min-h-screen px-4 sm:px-6">
          <DashboardHeader />
          <WelcomeSection />
          <div className="mt-6 flex justify-center">
            <SpinnerLoader size="lg" />
          </div>
          <AiChatBot />
        </div>
      </div>
    );
  }

  if (!subscription.isActive) {
    return (
      <div className="bg-gradient-to-br from-zinc-100 via-amber-50 to-amber-200 pb-6">
        <div className="container mx-auto min-h-screen px-4 sm:px-6">
          <DashboardHeader />
          <WelcomeSection />
          <TrialUpsellBanner
            className="mt-6"
            title="Start your 7-days free trial"
            description="Your subscription is not active yet. Start the free trial to access Auction List and Saved List features."
          />
          <AiChatBot />
        </div>
      </div>
    );
  }

  if (loading && auctions.length === 0) {
    return (
      <div className="bg-gradient-to-br from-zinc-100 via-amber-50 to-amber-200 pb-6">
        <div className="container mx-auto min-h-screen px-4 sm:px-6">
          <DashboardHeader />
          <WelcomeSection />
          <div className="mt-6 flex justify-center">
            <SpinnerLoader size="lg" />
          </div>
          <AiChatBot />
        </div>
      </div>
    );
  }

  if (error && auctions.length === 0) {
    return (
      <div className="bg-gradient-to-br from-zinc-100 via-amber-50 to-amber-200 pb-6">
        <div className="container mx-auto min-h-screen px-4 sm:px-6">
          <DashboardHeader />
          <WelcomeSection />
          <div className="mt-6 flex justify-center">
            <p className="text-red-600">{error}</p>
          </div>
          <AiChatBot />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-zinc-100 via-amber-50 to-amber-200 pb-6">
      <div className="container mx-auto min-h-screen px-4 sm:px-6">
        <DashboardHeader />
        <WelcomeSection />
        <DashboardFilters
          counties={filterOptions.counties}
          states={filterOptions.states}
          propertyTypes={filterOptions.types}
          bidRange={filterOptions.bidRange}
          onApply={handleApplyFilters}
        />
        <PropertySection
          properties={formattedAuctions}
          onToggleFavourite={handleToggleFavourite}
        />
        {loading && (
          <div className="mt-4 flex justify-center">
            <SpinnerLoader />
          </div>
        )}
        {pagination.totalPages > 1 && (
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1 || loading}
              className="rounded-full border border-amber-200 px-3 py-1 text-xs font-semibold text-amber-700 disabled:opacity-50"
            >
              Prev
            </button>
            {pageList.map((page) => (
              <button
                key={page}
                type="button"
                onClick={() => handlePageChange(page)}
                disabled={loading}
                className={
                  page === pagination.currentPage
                    ? "rounded-full bg-amber-400 px-3 py-1 text-xs font-semibold text-zinc-900"
                    : "rounded-full border border-amber-200 px-3 py-1 text-xs font-semibold text-amber-700"
                }
              >
                {page}
              </button>
            ))}
            <button
              type="button"
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              disabled={
                pagination.currentPage === pagination.totalPages || loading
              }
              className="rounded-full border border-amber-200 px-3 py-1 text-xs font-semibold text-amber-700 disabled:opacity-50"
            >
              Next
            </button>
            <span className="text-xs text-zinc-500">
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>
          </div>
        )}
        <AiChatBot />
      </div>
    </div>
  );
}

export default Dashboard;
