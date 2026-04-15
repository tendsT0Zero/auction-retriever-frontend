import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { GrFavorite } from "react-icons/gr";
import DashboardHeader from "../../shared/DashboardHeader";
import PropertyCard from "../../components/common/PropertyCard";
import TrialUpsellBanner from "../../components/common/TrialUpsellBanner";
import SpinnerLoader from "../../components/common/SpinnerLoader";
import { authStorage } from "../../services/authService";
import { getSavedAuctions, saveAuction } from "../../services/auctionService";
import { getSubscriptionStatus } from "../../services/subscriptionService";
import { extractSubscriptionAccess } from "../../utils/subscriptionStatus";

function SavedListings() {
  const [savedAuctions, setSavedAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [subscription, setSubscription] = useState({
    isLoading: true,
    isActive: false,
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    perPage: 10,
    totalPages: 1,
    totalItems: 0,
  });

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

  const fetchSavedAuctions = async (pageNumber, tokenOverride) => {
    const token = tokenOverride || authStorage.getToken();

    if (!token) {
      setError("Please login to view saved listings");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const perPage = pagination.perPage || 10;
      const response = await getSavedAuctions(token, {
        per_page: perPage,
        current_page: pageNumber,
      });

      if (response.status || response.success) {
        const { list, meta } = extractPaginatedList(response);
        setSavedAuctions(list);
        setPagination(
          buildPaginationState(meta, {
            currentPage: pageNumber,
            perPage,
          }),
        );
      } else {
        setError(response.message || "Failed to fetch saved listings");
      }
    } catch (err) {
      setError(err.message || "Error fetching saved listings");
      console.error("Error fetching saved auctions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;

    const bootstrap = async () => {
      const token = authStorage.getToken();

      if (!token) {
        if (!ignore) {
          setError("Please login to view saved listings");
          setLoading(false);
          setSubscription({
            isLoading: false,
            isActive: false,
          });
        }
        return;
      }

      try {
        setSubscription((prev) => ({ ...prev, isLoading: true }));
        const statusResponse = await getSubscriptionStatus(token);
        const access = extractSubscriptionAccess(statusResponse);

        if (ignore) {
          return;
        }

        setSubscription({
          isLoading: false,
          isActive: access.isActive,
        });

        if (!access.isActive) {
          setLoading(false);
          return;
        }

        await fetchSavedAuctions(1, token);
      } catch (statusError) {
        if (!ignore) {
          setSubscription({
            isLoading: false,
            isActive: false,
          });
          setError(statusError.message || "Unable to verify subscription");
          setLoading(false);
        }
      }
    };

    bootstrap();

    return () => {
      ignore = true;
    };
  }, []);

  // Format auction type from SINGLE_FAMILY to Single Family
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

  // Format saved auctions for PropertyCard component
  const formattedSavedListings = useMemo(() => {
    return savedAuctions.map((auction) => ({
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
      isFavourite: true,
    }));
  }, [savedAuctions]);

  const hasSavedListings = formattedSavedListings.length > 0;
  const totalSavedCount =
    pagination.totalItems || formattedSavedListings.length;

  const handleToggleFavourite = async (property, nextValue) => {
    if (!subscription.isActive) {
      setError("Start your 7-days free trial to access saved listings");
      return false;
    }

    try {
      const token = authStorage.getToken();

      if (!token) {
        setError("Please login to manage saved listings");
        return false;
      }

      const response = await saveAuction(property.id, token);

      if (response.status || response.success) {
        if (!nextValue) {
          setSavedAuctions((prev) =>
            prev.filter((auction) => auction.id !== property.id),
          );
          setPagination((prev) => ({
            ...prev,
            totalItems: prev.totalItems > 0 ? prev.totalItems - 1 : 0,
          }));
          if (savedAuctions.length <= 1 && pagination.currentPage > 1) {
            fetchSavedAuctions(pagination.currentPage - 1, token);
          }
        }
        return nextValue;
      }

      setError(response.message || "Failed to update saved listing");
      return !nextValue;
    } catch (error) {
      setError(error.message || "Failed to update saved listing");
      return !nextValue;
    }
  };

  const handlePageChange = (nextPage) => {
    if (!subscription.isActive) return;
    if (loading) return;
    if (nextPage < 1 || nextPage > pagination.totalPages) return;
    if (nextPage === pagination.currentPage) return;
    fetchSavedAuctions(nextPage);
  };

  const pageList = buildPageList(pagination.currentPage, pagination.totalPages);

  if (subscription.isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-100 via-amber-50 to-amber-200">
        <DashboardHeader />
        <div className="w-full container mx-auto px-4 pb-16">
          <div className="mt-4">
            <h1 className="text-2xl font-semibold text-zinc-900">
              Saved Listings
            </h1>
          </div>
          <div className="mt-6 flex justify-center">
            <SpinnerLoader size="lg" />
          </div>
        </div>
      </div>
    );
  }

  if (!subscription.isActive) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-100 via-amber-50 to-amber-200">
        <DashboardHeader />
        <div className="w-full container mx-auto px-4 pb-16">
          <div className="mt-4">
            <h1 className="text-2xl font-semibold text-zinc-900">
              Saved Listings
            </h1>
          </div>

          <TrialUpsellBanner
            className="mt-6"
            title="Start your 7-days free trial"
            description="Saved List access is locked until your subscription is active. Start your trial to unlock this section."
          />
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-100 via-amber-50 to-amber-200">
        <DashboardHeader />
        <div className="w-full container mx-auto px-4 pb-16">
          <div className="mt-4">
            <h1 className="text-2xl font-semibold text-zinc-900">
              Saved Listings
            </h1>
          </div>
          <div className="mt-6 flex justify-center">
            <SpinnerLoader size="lg" />
          </div>
        </div>
      </div>
    );
  }

  if (error && !hasSavedListings) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-100 via-amber-50 to-amber-200">
        <DashboardHeader />
        <div className="w-full container mx-auto px-4 pb-16">
          <div className="mt-4">
            <h1 className="text-2xl font-semibold text-zinc-900">
              Saved Listings
            </h1>
          </div>
          <div className="mt-6 flex justify-center">
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-100 via-amber-50 to-amber-200">
      <DashboardHeader />
      <div className="w-full container mx-auto px-4 pb-16">
        <div className="mt-4">
          <h1 className="text-2xl font-semibold text-zinc-900">
            Saved Listings
          </h1>
          <p className="text-sm text-zinc-400">
            {hasSavedListings
              ? `${totalSavedCount} listings saved`
              : "0 listings saved"}
          </p>
        </div>

        {hasSavedListings ? (
          <div>
            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {formattedSavedListings.map((property, index) => (
                <PropertyCard
                  key={`${property.id}-${property.address}-${index}`}
                  property={property}
                  onToggleFavourite={handleToggleFavourite}
                />
              ))}
            </div>
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
          </div>
        ) : (
          <div className="mt-16 flex justify-center">
            <div className="w-full max-w-[360px] rounded-2xl bg-white px-8 py-10 text-center shadow-md">
              <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-amber-500">
                <GrFavorite size={18} />
              </div>
              <h2 className="text-base font-semibold text-zinc-800">
                No saved listings yet
              </h2>
              <p className="mt-2 text-xs text-zinc-400">
                Start browsing listings and save your favourites to view them
                here
              </p>
              <Link
                to="/dashboard"
                className="mt-4 inline-flex rounded-full bg-amber-400 px-5 py-2 text-xs font-semibold text-zinc-900"
              >
                Browse Listings
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SavedListings;
