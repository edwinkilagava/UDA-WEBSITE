
import { useCallback, useEffect, useState } from "react";
import {
  Mail,
  RefreshCw,
  Trash2,
  CheckCircle,
  Clock,
  Eye,
  Inbox,
  AlertCircle,
} from "lucide-react";

import {
  getContactMessages,
  updateContactMessage,
  deleteContactMessage,
} from "../../../services/contact.service.js";

const STATUS_STYLES = {
  unread: "bg-amber-100 text-amber-800",
  read: "bg-blue-100 text-blue-800",
  resolved: "bg-green-100 text-green-800",
};

function getMessagesFromResponse(response) {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.messages)) return response.messages;
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.data?.messages)) {
    return response.data.messages;
  }
  return [];
}

function formatDate(date) {
  if (!date) return "Unknown date";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Unknown date";
  }

  return parsedDate.toLocaleString();
}

function Messages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");
  const [actionError, setActionError] = useState("");
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [updatingId, setUpdatingId] = useState("");
  const [deletingId, setDeletingId] = useState("");

  const loadMessages = useCallback(async () => {
    setLoading(true);
    setPageError("");

    try {
      const response = await getContactMessages();
      setMessages(getMessagesFromResponse(response));
    } catch (error) {
      console.error("Failed to load contact messages:", error);

      setPageError(
        error.response?.data?.message ||
          "Unable to load messages. Check your admin login and backend."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  const unreadCount = messages.filter(
    (message) => message.status === "unread"
  ).length;

  async function handleStatusChange(message, status) {
    setUpdatingId(message._id);
    setActionError("");

    try {
      const response = await updateContactMessage(message._id, {
        status,
      });

      const updatedMessage =
        response?.message ||
        response?.data?.message ||
        response?.data;

      setMessages((previous) =>
        previous.map((item) =>
          item._id === message._id
            ? {
                ...item,
                status:
                  updatedMessage?.status &&
                  typeof updatedMessage.status === "string"
                    ? updatedMessage.status
                    : status,
              }
            : item
        )
      );

      setSelectedMessage((previous) =>
        previous?._id === message._id
          ? { ...previous, status }
          : previous
      );
    } catch (error) {
      console.error("Failed to update message:", error);

      setActionError(
        error.response?.data?.message ||
          "Could not update the message status."
      );
    } finally {
      setUpdatingId("");
    }
  }

  async function handleDelete(message) {
    const confirmed = window.confirm(
      `Delete the message from ${message.name || "this sender"}? This cannot be undone.`
    );

    if (!confirmed) return;

    setDeletingId(message._id);
    setActionError("");

    try {
      await deleteContactMessage(message._id);

      setMessages((previous) =>
        previous.filter((item) => item._id !== message._id)
      );

      setSelectedMessage((previous) =>
        previous?._id === message._id ? null : previous
      );
    } catch (error) {
      console.error("Failed to delete message:", error);

      setActionError(
        error.response?.data?.message ||
          "Could not delete the message."
      );
    } finally {
      setDeletingId("");
    }
  }

  return (
    <section className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-green-700">
              Administration
            </p>

            <h1 className="mt-2 text-3xl font-bold text-gray-900">
              Contact Messages
            </h1>

            <p className="mt-2 text-sm text-gray-600">
              View and manage messages submitted through the website.
            </p>
          </div>

          <button
            type="button"
            onClick={loadMessages}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 disabled:opacity-60"
          >
            <RefreshCw
              size={16}
              className={loading ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </div>

        {/* Summary */}
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-600">
                Total messages
              </p>
              <Inbox className="text-green-700" size={22} />
            </div>
            <p className="mt-3 text-3xl font-bold text-gray-900">
              {messages.length}
            </p>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-600">
                Unread messages
              </p>
              <Mail className="text-amber-600" size={22} />
            </div>
            <p className="mt-3 text-3xl font-bold text-gray-900">
              {unreadCount}
            </p>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-600">
                Resolved messages
              </p>
              <CheckCircle className="text-green-700" size={22} />
            </div>
            <p className="mt-3 text-3xl font-bold text-gray-900">
              {
                messages.filter(
                  (message) => message.status === "resolved"
                ).length
              }
            </p>
          </div>
        </div>

        {/* Errors */}
        {(pageError || actionError) && (
          <div
            role="alert"
            className="mt-6 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            <AlertCircle className="mt-0.5 shrink-0" size={18} />
            <div>{pageError || actionError}</div>
          </div>
        )}

        {/* Messages list */}
        <div className="mt-8 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 px-5 py-4">
            <h2 className="font-semibold text-gray-900">
              Inbox
            </h2>
          </div>

          {loading ? (
            <div className="flex items-center justify-center gap-3 p-12 text-gray-600">
              <RefreshCw className="animate-spin" size={20} />
              Loading messages...
            </div>
          ) : messages.length === 0 && !pageError ? (
            <div className="p-12 text-center">
              <Inbox
                size={38}
                className="mx-auto text-gray-400"
              />
              <h3 className="mt-4 font-semibold text-gray-900">
                No messages yet
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Messages submitted through the Contact page will appear here.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {messages.map((message) => (
                <article
                  key={message._id}
                  className={`p-5 transition hover:bg-gray-50 ${
                    message.status === "unread" ? "bg-green-50/40" : ""
                  }`}
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="break-words font-semibold text-gray-900">
                          {message.subject || "No subject"}
                        </h3>

                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${
                            STATUS_STYLES[message.status] ||
                            "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {message.status || "unread"}
                        </span>
                      </div>

                      <p className="mt-2 text-sm text-gray-700">
                        <span className="font-medium">
                          {message.name}
                        </span>
                        {" · "}
                        <a
                          href={`mailto:${message.email}`}
                          className="break-all text-green-700 hover:underline"
                        >
                          {message.email}
                        </a>
                      </p>

                      <p className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                        <Clock size={14} />
                        {formatDate(message.createdAt)}
                      </p>

                      <p className="mt-4 whitespace-pre-wrap break-words text-sm leading-6 text-gray-700">
                        {message.message}
                      </p>

                      <div className="mt-5 flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedMessage(message)}
                          className="inline-flex items-center gap-2 rounded-md border border-gray-300 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-100"
                        >
                          <Eye size={15} />
                          View details
                        </button>

                        {message.status !== "read" &&
                          message.status !== "resolved" && (
                            <button
                              type="button"
                              disabled={updatingId === message._id}
                              onClick={() =>
                                handleStatusChange(message, "read")
                              }
                              className="rounded-md border border-blue-200 px-3 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-50 disabled:opacity-60"
                            >
                              Mark as read
                            </button>
                          )}

                        {message.status !== "resolved" && (
                          <button
                            type="button"
                            disabled={updatingId === message._id}
                            onClick={() =>
                              handleStatusChange(message, "resolved")
                            }
                            className="rounded-md border border-green-200 px-3 py-2 text-xs font-semibold text-green-700 hover:bg-green-50 disabled:opacity-60"
                          >
                            Mark resolved
                          </button>
                        )}

                        <button
                          type="button"
                          disabled={deletingId === message._id}
                          onClick={() => handleDelete(message)}
                          className="inline-flex items-center gap-2 rounded-md border border-red-200 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-50 disabled:opacity-60"
                        >
                          <Trash2 size={14} />
                          {deletingId === message._id
                            ? "Deleting..."
                            : "Delete"}
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Message details modal */}
      {selectedMessage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedMessage(null);
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="message-details-title"
            className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white p-6 shadow-xl"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-green-700">
                  Contact message
                </p>
                <h2
                  id="message-details-title"
                  className="mt-2 text-2xl font-bold text-gray-900"
                >
                  {selectedMessage.subject || "No subject"}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setSelectedMessage(null)}
                aria-label="Close message details"
                className="rounded-md px-3 py-1 text-2xl text-gray-500 hover:bg-gray-100"
              >
                &times;
              </button>
            </div>

            <div className="mt-6 space-y-4 text-sm">
              <div>
                <p className="text-gray-500">Sender</p>
                <p className="mt-1 font-medium text-gray-900">
                  {selectedMessage.name}
                </p>
              </div>

              <div>
                <p className="text-gray-500">Email</p>
                <a
                  href={`mailto:${selectedMessage.email}`}
                  className="mt-1 inline-block break-all font-medium text-green-700 hover:underline"
                >
                  {selectedMessage.email}
                </a>
              </div>

              <div>
                <p className="text-gray-500">Received</p>
                <p className="mt-1 text-gray-900">
                  {formatDate(selectedMessage.createdAt)}
                </p>
              </div>

              <div>
                <p className="text-gray-500">Message</p>
                <p className="mt-2 whitespace-pre-wrap break-words rounded-md bg-gray-50 p-4 leading-7 text-gray-800">
                  {selectedMessage.message}
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap justify-end gap-3">
              {selectedMessage.status !== "resolved" && (
                <button
                  type="button"
                  disabled={updatingId === selectedMessage._id}
                  onClick={() =>
                    handleStatusChange(selectedMessage, "resolved")
                  }
                  className="rounded-md bg-green-700 px-4 py-2 text-sm font-semibold text-white hover:bg-green-800 disabled:opacity-60"
                >
                  Mark resolved
                </button>
              )}

              <button
                type="button"
                onClick={() => setSelectedMessage(null)}
                className="rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default Messages;
