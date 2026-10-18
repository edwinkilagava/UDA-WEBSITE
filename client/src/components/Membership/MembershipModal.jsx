
import { useState } from "react";
import { registerMember } from "../../services/membership.service";

const counties = [
  "Baringo", "Bomet", "Bungoma", "Busia", "Elgeyo-Marakwet",
  "Embu", "Garissa", "Homa Bay", "Isiolo", "Kajiado",
  "Kakamega", "Kericho", "Kiambu", "Kilifi", "Kirinyaga",
  "Kisii", "Kisumu", "Kitui", "Kwale", "Laikipia", "Lamu",
  "Machakos", "Makueni", "Mandera", "Marsabit", "Meru",
  "Migori", "Mombasa", "Murang'a", "Nairobi", "Nakuru",
  "Nandi", "Narok", "Nyamira", "Nyandarua", "Nyeri",
  "Samburu", "Siaya", "Taita-Taveta", "Tana River",
  "Tharaka-Nithi", "Trans Nzoia", "Turkana", "Uasin Gishu",
  "Vihiga", "Wajir", "West Pokot",
];

const initialForm = {
  fullName: "",
  email: "",
  phone: "",
  county: "",
  yearOfBirth: "",
};

const labelClass = "mb-2 block text-sm font-semibold text-slate-700";
const fieldClass =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-green-600 focus:ring-4 focus:ring-green-100";
const primaryButton =
  "inline-flex items-center justify-center rounded-xl bg-green-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60";

function Spinner() {
  return (
    <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
  );
}

function Detail({ label, value }) {
  return (
    <div className="rounded-xl bg-slate-50 p-3">
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <p className="mt-1 break-words text-sm font-semibold text-slate-800">
        {value || "Not provided"}
      </p>
    </div>
  );
}

export default function MembershipModal({ onClose }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(false);

  const currentYear = new Date().getFullYear();

  function updateField(event) {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
    setError("");
  }

  function continueToReview(event) {
    event.preventDefault();

    if (
      !form.fullName.trim() ||
      !form.email.trim() ||
      !form.phone.trim() ||
      !form.county ||
      !form.yearOfBirth
    ) {
      setError("Please fill in all the required fields.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!/^\+?[0-9\s()-]{9,16}$/.test(form.phone)) {
      setError("Please enter a valid phone number.");
      return;
    }

    const year = Number(form.yearOfBirth);

    if (year < 1900 || year > currentYear) {
      setError("Please enter a valid year of birth.");
      return;
    }

    setError("");
    setStep(2);
  }

  async function submitRegistration() {
    setLoading(true);
    setError("");

    try {
      const result = await registerMember({
        ...form,
        fullName: form.fullName.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone.trim(),
        yearOfBirth: Number(form.yearOfBirth),
      });

      // Save the actual member details returned by the backend.
      if (!result.success || !result.data) {
        throw new Error(result.message || "Registration could not be completed.");
      }

      setMember(result.data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/70 p-3 backdrop-blur-sm sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !loading) onClose();
      }}
    >
      <div className="relative grid w-full max-w-4xl overflow-hidden rounded-3xl bg-white shadow-2xl lg:grid-cols-[0.85fr_1.15fr]">

        {/* LEFT BRAND PANEL */}
        <aside className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-green-950 via-green-800 to-green-600 p-8 text-white lg:flex">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10" />
          <div className="absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-yellow-400/10" />

          <div className="relative">
            <div className="mb-10 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-xl font-black text-green-800">
                U
              </div>
              <div>
                <p className="font-black tracking-wide">UDA</p>
                <p className="text-xs text-green-100">Membership registration</p>
              </div>
            </div>

            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-yellow-300">
              Join the movement
            </p>
            <h2 className="text-4xl font-black leading-tight">
              Your voice.
              <br />
              Your county.
              <br />
              Your movement.
            </h2>
            <p className="mt-5 max-w-xs text-sm leading-6 text-green-50">
              Register your membership and become part of the UDA community.
            </p>
          </div>

          <div className="relative space-y-5">
            {["Your details", "Review & submit"].map((title, index) => (
              <div key={title} className="flex items-center gap-3">
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold ${
                    step === index + 1
                      ? "bg-yellow-400 text-green-950"
                      : "border border-white/30 text-white"
                  }`}
                >
                  {index + 1}
                </span>
                <div>
                  <p className="text-sm font-bold">{title}</p>
                  <p className="text-xs text-green-100">
                    {index === 0 ? "Enter your information" : "Check your details"}
                  </p>
                </div>
              </div>
            ))}

            <p className="border-t border-white/20 pt-5 text-xs text-green-100">
              Please ensure your information is accurate before submitting.
            </p>
          </div>
        </aside>

        {/* RIGHT CONTENT PANEL */}
        <section className="p-5 sm:p-8 lg:p-10">
          <div className="mb-7 flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-green-700">
                UDA membership
              </p>
              <h2 className="mt-2 text-2xl font-black text-slate-900 sm:text-3xl">
                {member
                  ? "Registration successful!"
                  : step === 1
                    ? "Become a member"
                    : "Review your details"}
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                {member
                  ? "Your membership has been registered successfully."
                  : step === 1
                    ? "Fill in your details to get started."
                    : "Check your information before submitting."}
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              aria-label="Close registration"
              className="rounded-full p-2 text-2xl leading-none text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
            >
              &times;
            </button>
          </div>

          {/* ERROR MESSAGE */}
          {error && (
            <div
              role="alert"
              className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
            >
              {error}
            </div>
          )}

          {/* SUCCESS SCREEN WITH SAVED MEMBER DETAILS */}
          {member ? (
            <div>
              <div className="mb-6 rounded-2xl border border-green-200 bg-green-50 p-5 text-center">
                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-green-600 text-3xl font-bold text-white">
                  ✓
                </div>
                <h3 className="text-xl font-black text-green-900">
                  Membership confirmed!
                </h3>
                <p className="mt-2 text-sm leading-6 text-green-800">
                  Congratulations, {member.fullName}. Your registration was
                  successful, and your membership status is confirmed.
                </p>
              </div>

              <h3 className="mb-3 font-bold text-slate-800">
                Your registered details
              </h3>

              <div className="grid gap-3 sm:grid-cols-2">
                <Detail label="Full name" value={member.fullName} />
                <Detail label="Email address" value={member.email} />
                <Detail label="Phone number" value={member.phone} />
                <Detail label="County" value={member.county} />
                <Detail label="Year of birth" value={member.yearOfBirth} />
                <Detail
                  label="Membership status"
                  value={member.status}
                />
              </div>

              <button
                type="button"
                onClick={onClose}
                className={`${primaryButton} mt-7 w-full`}
              >
                Done
              </button>
            </div>
          ) : step === 1 ? (
            <form onSubmit={continueToReview} className="space-y-5">
              <div>
                <label className={labelClass}>Full name</label>
                <input
                  className={fieldClass}
                  name="fullName"
                  value={form.fullName}
                  onChange={updateField}
                  placeholder="Enter your full name"
                  autoComplete="name"
                  required
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>Email address</label>
                  <input
                    className={fieldClass}
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={updateField}
                    placeholder="you@example.com"
                    autoComplete="email"
                    required
                  />
                </div>

                <div>
                  <label className={labelClass}>Phone number</label>
                  <input
                    className={fieldClass}
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={updateField}
                    placeholder="07XX XXX XXX"
                    autoComplete="tel"
                    required
                  />
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>County</label>
                  <select
                    className={fieldClass}
                    name="county"
                    value={form.county}
                    onChange={updateField}
                    required
                  >
                    <option value="">Select your county</option>
                    {counties.map((county) => (
                      <option key={county} value={county}>
                        {county}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={labelClass}>Year of birth</label>
                  <input
                    className={fieldClass}
                    type="number"
                    name="yearOfBirth"
                    value={form.yearOfBirth}
                    onChange={updateField}
                    placeholder="e.g. 2000"
                    min="1900"
                    max={currentYear}
                    required
                  />
                </div>
              </div>

              <button type="submit" className={`${primaryButton} w-full`}>
                Review your details <span className="ml-2">→</span>
              </button>
            </form>
          ) : (
            <div>
              <div className="grid gap-3 sm:grid-cols-2">
                <Detail label="Full name" value={form.fullName} />
                <Detail label="Email address" value={form.email} />
                <Detail label="Phone number" value={form.phone} />
                <Detail label="County" value={form.county} />
                <Detail label="Year of birth" value={form.yearOfBirth} />
              </div>

              <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  disabled={loading}
                  className="w-full rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                >
                  Back to edit
                </button>

                <button
                  type="button"
                  onClick={submitRegistration}
                  disabled={loading}
                  className={`${primaryButton} w-full`}
                >
                  {loading && <Spinner />}
                  {loading ? "Registering..." : "Confirm registration"}
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
