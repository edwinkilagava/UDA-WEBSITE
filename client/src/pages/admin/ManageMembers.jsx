
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import api from "../../services/api.js";

function extractMembers(response) {
  if (Array.isArray(response)) {
    return response;
  }

  if (Array.isArray(response?.members)) {
    return response.members;
  }

  if (Array.isArray(response?.data)) {
    return response.data;
  }

  if (Array.isArray(response?.data?.members)) {
    return response.data.members;
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
    "Unable to load members. Please try again."
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
  }).format(date);
}

function getStatusClass(status) {
  switch (String(status || "").toLowerCase()) {
    case "active":
      return "bg-green-100 text-green-800";

    case "pending":
      return "bg-amber-100 text-amber-800";

    case "suspended":
      return "bg-red-100 text-red-800";

    default:
      return "bg-gray-100 text-gray-700";
  }
}

function ManageMembers() {
  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");

  const loadMembers = useCallback(async () => {
    setLoading(true);
    setPageError("");

    try {
      /*
       * This assumes the backend exposes GET /members for admins.
       * Confirm the actual route and response shape in your backend.
       */
      const response = await api.get("/members");
      setMembers(extractMembers(response.data));
    } catch (error) {
      setPageError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMembers();
  }, [loadMembers]);

  const filteredMembers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return members.filter((member) => {
      const searchableText = [
        member.fullName,
        member.name,
        member.email,
        member.phone,
        member.county,
        member.membershipNumber,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        !query || searchableText.includes(query);

      const status = String(
        member.membershipStatus || member.status || ""
      ).toLowerCase();

      const matchesStatus =
        statusFilter === "all" || status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [members, search, statusFilter]);

  const activeCount = members.filter(
    (member) =>
      String(
        member.membershipStatus || member.status || ""
      ).toLowerCase() === "active"
  ).length;

  const pendingCount = members.filter(
    (member) =>
      String(
        member.membershipStatus || member.status || ""
      ).toLowerCase() === "pending"
  ).length;

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
          Manage Members
        </h1>

        <p className="mt-2 text-sm leading-6 text-gray-600">
          Review membership registrations and search the member
          records available to your administrator account.
        </p>
      </div>

      {!loading && !pageError && (
        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-600">Total records</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              {members.length}
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-600">Active members</p>
            <p className="mt-2 text-3xl font-bold text-green-800">
              {activeCount}
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-600">Pending registrations</p>
            <p className="mt-2 text-3xl font-bold text-amber-700">
              {pendingCount}
            </p>
          </div>
        </div>
      )}

      <div className="mb-6 flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:flex-row sm:items-end">
        <div className="flex-1">
          <label
            htmlFor="member-search"
            className="mb-2 block text-sm font-semibold text-gray-800"
          >
            Search members
          </label>

          <input
            id="member-search"
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by name, email, phone, or county"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-green-700 focus:ring-2 focus:ring-green-700/20"
          />
        </div>

        <div className="sm:w-56">
          <label
            htmlFor="status-filter"
            className="mb-2 block text-sm font-semibold text-gray-800"
          >
            Membership status
          </label>

          <select
            id="status-filter"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-green-700 focus:ring-2 focus:ring-green-700/20"
          >
            <option value="all">All statuses</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>

        <button
          type="button"
          onClick={loadMembers}
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
            Unable to load members
          </h2>

          <p className="mt-2 text-sm text-red-700">{pageError}</p>

          <button
            type="button"
            onClick={loadMembers}
            className="mt-5 rounded-lg bg-green-800 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-green-900"
          >
            Try again
          </button>
        </div>
      )}

      {!pageError && loading && (
        <div className="rounded-xl border border-gray-200 bg-white p-12 text-center shadow-sm">
          <p className="text-sm text-gray-600">
            Loading member records...
          </p>
        </div>
      )}

      {!pageError && !loading && members.length === 0 && (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white px-6 py-14 text-center">
          <h2 className="text-lg font-semibold text-gray-900">
            No member records found
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-600">
            No records were returned by the membership API. New
            registrations will appear here when available.
          </p>
        </div>
      )}

      {!pageError && !loading && members.length > 0 &&
        filteredMembers.length === 0 && (
          <div className="rounded-xl border border-gray-200 bg-white px-6 py-12 text-center">
            <h2 className="font-semibold text-gray-900">
              No matching members
            </h2>

            <p className="mt-2 text-sm text-gray-600">
              Try changing the search term or membership status.
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

      {!pageError && !loading && filteredMembers.length > 0 && (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
            <h2 className="font-semibold text-gray-900">
              Member records
            </h2>

            <span className="text-sm text-gray-500">
              {filteredMembers.length} result
              {filteredMembers.length === 1 ? "" : "s"}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                    Member
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                    Contact
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                    County
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                    Status
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                    Registered
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filteredMembers.map((member, index) => {
                  const name =
                    member.fullName ||
                    member.name ||
                    "Name not provided";

                  const status = String(
                    member.membershipStatus ||
                    member.status ||
                    "unknown"
                  ).toLowerCase();

                  return (
                    <tr
                      key={member._id || member.id || `${member.email}-${index}`}
                      className="transition hover:bg-gray-50"
                    >
                      <td className="px-5 py-4">
                        <p className="font-semibold text-gray-900">
                          {name}
                        </p>

                        {member.membershipNumber && (
                          <p className="mt-1 text-xs text-gray-500">
                            Member no. {member.membershipNumber}
                          </p>
                        )}
                      </td>

                      <td className="px-5 py-4">
                        <p className="text-sm text-gray-800">
                          {member.email || "No email provided"}
                        </p>

                        <p className="mt-1 text-sm text-gray-500">
                          {member.phone || "No phone provided"}
                        </p>
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-700">
                        {member.county || "Not provided"}
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
                          member.createdAt ||
                          member.registeredAt ||
                          member.registrationDate
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

export default ManageMembers;
