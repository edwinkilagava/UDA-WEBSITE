
import { useState } from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import heroImage from "../../assets/hero.jpg";
import { createContactMessage } from "../../services/contact.service.js";

const INITIAL_FORM_DATA = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
};

function Contact() {
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    // Clear old feedback when the visitor edits the form.
    setSuccess("");
    setError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setLoading(true);
    setSuccess("");
    setError("");

    try {
      await createContactMessage({
        name: formData.name.trim(),
        email: formData.email.trim(),
        subject: formData.subject.trim(),
        message: formData.message.trim(),
      });

      setSuccess(
        "Your message has been sent successfully. Thank you for contacting us."
      );

      setFormData({ ...INITIAL_FORM_DATA });
    } catch (err) {
      console.error("Failed to send contact message:", err);

      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "We were unable to send your message. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      {/* Hero */}
      <section
        className="relative flex min-h-[405px] items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-green-900/70" />

        <div className="relative z-10 px-6 text-center text-white">
          <p className="text-base font-semibold">Get in touch</p>

          <div className="mx-auto mt-3 h-0.5 w-10 bg-white" />

          <h1 className="mt-4 text-5xl font-bold sm:text-6xl">
            Contact
          </h1>
        </div>
      </section>

      {/* Contact Section */}
      <section className="bg-gray-100 py-16 sm:py-20">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 lg:grid-cols-3">
          {/* Contact Information */}
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-green-700">
              Contact Us
            </p>

            <div className="mt-3 h-0.5 w-10 bg-green-700" />

            <h2 className="mt-4 text-3xl font-bold text-gray-900">
              Get in touch with us
            </h2>

            <p className="mt-4 leading-7 text-gray-600">
              Have a question, suggestion, or message for us?
              Send us a message and our team will get back to you.
            </p>

            <div className="mt-8 space-y-6">
              {/* Address */}
              <div className="flex gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-green-700 text-white">
                  <MapPin size={20} />
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900">
                    Address
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-gray-600">
                    United Democratic Alliance
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-green-700 text-white">
                  <Phone size={20} />
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900">
                    Phone
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-gray-600">
                    Contact us by phone
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-green-700 text-white">
                  <Mail size={20} />
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900">
                    Email
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-gray-600">
                    Send us an email
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="rounded-lg bg-white p-6 shadow-sm sm:p-8">
              <h2 className="text-2xl font-bold text-gray-900">
                Send Us a Message
              </h2>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                Fill in the form below and we will get back to you.
              </p>

              {/* Success Message */}
              {success && (
                <div
                  role="status"
                  aria-live="polite"
                  className="mt-6 rounded-lg border border-green-200 bg-green-50 p-4"
                >
                  <p className="text-sm font-medium text-green-700">
                    {success}
                  </p>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div
                  role="alert"
                  className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4"
                >
                  <p className="text-sm font-medium text-red-700">
                    {error}
                  </p>
                </div>
              )}

              <form
                onSubmit={handleSubmit}
                className="mt-8 space-y-6"
              >
                {/* Name + Email */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-900"
                    >
                      First &amp; Last name
                    </label>

                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      maxLength={100}
                      autoComplete="name"
                      className="mt-2 w-full rounded-sm border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-green-700 focus:ring-2 focus:ring-green-700/20"
                      placeholder="First & Last name"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-900"
                    >
                      Email
                    </label>

                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      maxLength={254}
                      autoComplete="email"
                      className="mt-2 w-full rounded-sm border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-green-700 focus:ring-2 focus:ring-green-700/20"
                      placeholder="Email address"
                    />
                  </div>
                </div>

                {/* Phone + Subject */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-gray-900"
                    >
                      Phone
                    </label>

                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      autoComplete="tel"
                      maxLength={30}
                      className="mt-2 w-full rounded-sm border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-green-700 focus:ring-2 focus:ring-green-700/20"
                      placeholder="Phone number (optional)"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="subject"
                      className="block text-sm font-medium text-gray-900"
                    >
                      Subject
                    </label>

                    <input
                      id="subject"
                      name="subject"
                      type="text"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      maxLength={200}
                      className="mt-2 w-full rounded-sm border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-green-700 focus:ring-2 focus:ring-green-700/20"
                      placeholder="Subject"
                    />
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-900"
                  >
                    Message
                  </label>

                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    maxLength={10000}
                    rows={7}
                    className="mt-2 w-full resize-none rounded-sm border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-green-700 focus:ring-2 focus:ring-green-700/20"
                    placeholder="Write your message..."
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-sm bg-green-700 px-7 py-3 text-sm font-semibold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Sending..." : "Send Message"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Contact;
