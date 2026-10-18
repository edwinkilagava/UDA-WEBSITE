
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import api from "../../services/api.js";

function extractContributions(response) {
  if (Array.isArray(response)) {
    return response;
  }

  if (Array.isArray(response?.contributions)) {
    return response.contributions;
  }

  if (Array.isArray(response?.data)) {
    return response.data;
  }

  if (Array.isArray(response?.data?.contributions)) {
    return response.data.contributions;
  }

  if (Array.isArray(response?.data?.data)) {
    return response.data.data;
  }

  return [];
}

function getErrorMessage(error) {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    "Unable to load contribution records. Please try again."
  );
}

function formatDate(value) {
  if (!value) return "Not available";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not available";
  }

  return new Intl.DateTimeFormat("en-KE", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function formatAmount(amount, currency = "KES") {
  const numericAmount = Number(amount);

  if (!Number.isFinite(numericAmount)) {
    return "Not available";
  }

  try {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(numericAmount);
  } catch {
    return `${currency} ${numericAmount.toLocaleString("en-KE")}`;
  }
}

function normalizeStatus(contribution) {
  return String(
    contribution?.status ||
      contribution?.paymentStatus ||
      "unknown"
  ).toLowerCase();
}

function getStatusClass(status) {
  switch (status) {
    case "successful":
    case "completed":
    case "paid":
      return "bg-green-100 text-green-800";

    case "pending":
    case "processing":
      return "bg-amber-100 text-amber-800";

    case "failed":
    case "cancelled":
    case "canceled":
      return "bg-red-100 text-red-800";

    default:
      return "bg-gray-100 text-gray-700";
  }
}

function ManageContributions() {
  const [contributions, setContributions] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");

  const loadContributions = useCallback(async () => {
    setLoading(true);
    setPageError("");

    try {
      /*
       * Assumes the backend provides GET /api/contributions
       * and enforces administrator authorization.
       */
      const response = await api.get("/contributions");

      setContributions(extractContributions(response.data));
    } catch (error) {
      setPageError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadContributions();
  }, [loadContributions]);

  const filteredContributions = useMemo(() => {
    const query = search.trim().toLowerCase();

    return contributions.filter((contribution) => {
      const searchableText = [
        contribution?.fullName,
        contribution?.name,
        contribution?.email,
        contribution?.phone,
        contribution?.transactionId,
        contribution?.receiptNumber,
        contribution?.mpesaReceiptNumber,
        contribution?.reference,
        contribution?.paymentMethod,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        !query || searchableText.includes(query);

      const status = normalizeStatus(contribution);

      const matchesStatus =
        statusFilter === "all" || status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [contributions, search, statusFilter]);

  const successfulContributions = contributions.filter((item) =>
    ["successful", "completed", "paid"].includes(normalizeStatus(item))
  );

  const pendingContributions = contributions.filter((item) =>
    ["pending", "processing"].includes(normalizeStatus(item))
  );

  /*
   * Only sum records whose backend status indicates a completed payment.
   * The actual payment-provider confirmation must happen on the server.
   */
  const confirmedTotal = successfulContributions.reduce(
    (total, item) => {
      const amount = Number(item.amount);

      return Number.isFinite(amount) && amount > 0
        ? total + amount
        : total;
    },
    0
  );

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <Link
          to="/admin"
          className="text-sm font-semibold text-green-800 hover:text-green-950"
        >
          &larr; Admin Dashboard
        </Link>

        <h1 className="mt-4 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          Manage Contributions
        </h1>

        <p className="mt-2 text-sm leading-6 text-gray-600">
          Review donation records, transaction references, and payment
          statuses returned by the backend.
        </p>
      </div>

      {!loading && !pageError && (
        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-600">
              Total contribution records
            </p>

            <p className="mt-2 text-3xl font-bold text-gray-900">
              {contributions.length}
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-600">
              Pending payments
            </p>

            <p className="mt-2 text-3xl font-bold text-amber-700">
              {pendingContributions.length}
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-600">
              Confirmed contribution total
            </p>

            <p className="mt-2 break-words text-2xl font-bold text-green-800">
              {formatAmount(confirmedTotal)}
            </p>

            <p className="mt-1 text-xs text-gray-500">
              Based on records marked completed, successful, or paid.
            </p>
          </div>
        </div>
      )}

      <div className="mb-6 flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:flex-row sm:items-end">
        <div className="flex-1">
          <label
            htmlFor="contribution-search"
            className="mb-2 block text-sm font-semibold text-gray-800"
          >
            Search contributions
          </label>

          <input
            id="contribution-search"
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search name, phone, receipt, or reference"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-green-700 focus:ring-2 focus:ring-green-700/20"
          />
        </div>

        <div className="sm:w-56">
          <label
            htmlFor="contribution-status"
            className="mb-2 block text-sm font-semibold text-gray-800"
          >
            Payment status
          </label>

          <select
            id="contribution-status"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-green-700 focus:ring-2 focus:ring-green-700/20"
          >
            <option value="all">All statuses</option>
            <option value="successful">Successful</option>
            <option value="completed">Completed</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="failed">Failed</option>
            <option value="cancelled">Cancelled</option>
            <option value="canceled">Canceled</option>
          </select>
        </div>

        <button
          type="button"
          onClick={loadContributions}
          disabled={loading}
          className="rounded-lg border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {pageError && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-white p-6 shadow-sm"
        >
          <h2 className="font-semibold text-gray-900">
            Unable to load contributions
          </h2>

          <p className="mt-2 text-sm text-red-700">
            {pageError}
          </p>

          <button
            type="button"
            onClick={loadContributions}
            className="mt-5 rounded-lg bg-green-800 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-green-900"
          >
            Try again
          </button>
        </div>
      )}

      {!pageError && loading && (
        <div className="rounded-xl border border-gray-200 bg-white p-12 text-center shadow-sm">
          <p className="text-sm text-gray-600">
            Loading contribution records...
          </p>
        </div>
      )}

      {!pageError && !loading && contributions.length === 0 && (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white px-6 py-14 text-center">
          <h2 className="text-lg font-semibold text-gray-900">
            No contribution records found
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-600">
            No records were returned by the contribution API. Records
            will appear here when the backend stores them.
          </p>
        </div>
      )}

      {!pageError &&
        !loading &&
        contributions.length > 0 &&
        filteredContributions.length === 0 && (
          <div className="rounded-xl border border-gray-200 bg-white px-6 py-12 text-center">
            <h2 className="font-semibold text-gray-900">
              No matching contributions
            </h2>

            <p className="mt-2 text-sm text-gray-600">
              Try changing your search or payment status filter.
            </p>

            <button
              type="button"
              onClick={() => {
                setSearch("");
                setStatusFilter("all");
              }}
              className="mt-4 text-sm font-semibold text-green-800 hover:text-green-950"
            >
              Clear filters
            </button>
          </div>
        )}

      {!pageError && !loading && filteredContributions.length > 0 && (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
            <h2 className="font-semibold text-gray-900">
              Contribution records
            </h2>

            <span className="text-sm text-gray-500">
              {filteredContributions.length} result
              {filteredContributions.length === 1 ? "" : "s"}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                    Contributor
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                    Amount
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                    Payment method
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                    Reference
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                    Status
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                    Date
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filteredContributions.map((item, index) => {
                  const status = normalizeStatus(item);

                  const reference =
                    item.mpesaReceiptNumber ||
                    item.receiptNumber ||
                    item.transactionId ||
                    item.reference ||
                    "Not available";

                  const contributor =
                    item.fullName ||
                    item.name ||
                    item.email ||
                    "Contributor not identified";

                  return (
                    <tr
                      key={
                        item._id ||
                        item.id ||
                        `${reference}-${index}`
                      }
                      className="transition hover:bg-gray-50"
                    >
                      <td className="px-5 py-4">
                        <p className="font-semibold text-gray-900">
                          {contributor}
                        </p>

                        {item.email && item.name && (
                          <p className="mt-1 text-sm text-gray-500">
                            {item.email}
                          </p>
                        )}

                        {item.phone && (
                          <p className="mt-1 text-sm text-gray-500">
                            {item.phone}
                          </p>
                        )}
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 text-sm font-semibold text-gray-900">
                        {formatAmount(
                          item.amount,
                          item.currency || "KES"
                        )}
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-700">
                        {item.paymentMethod ||
                          item.method ||
                          "Not specified"}
                      </td>

                      <td className="max-w-48 break-words px-5 py-4 text-sm text-gray-600">
                        {reference}
                      </td>

                      <td className="whitespace-nowrap px-5 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusClass(status)}`}
                        >
                          {status}
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-600">
                        {formatDate(
                          item.paidAt ||
                          item.completedAt ||
                          item.createdAt ||
                          item.created_at
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}

export default ManageContributions;
