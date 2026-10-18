
import { useState } from "react";
import { createDonation } from "../../services/donate.service.js";

const PRESET_AMOUNTS = [100, 200, 500, 1000];

const normalizeKenyanPhone = (value) => {
  const phone = value.trim().replace(/[\s()-]/g, "");

  if (/^0[17]\d{8}$/.test(phone)) {
    return `254${phone.slice(1)}`;
  }

  if (/^\+254[17]\d{8}$/.test(phone)) {
    return phone.slice(1);
  }

  if (/^254[17]\d{8}$/.test(phone)) {
    return phone;
  }

  return null;
};

function Donate() {
  const [amount, setAmount] = useState("500");
  const [donorName, setDonorName] = useState("");
  const [phone, setPhone] = useState("");
  const [anonymous, setAnonymous] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [paymentRequest, setPaymentRequest] = useState(null);

  const amountValue = Number(amount);

  const formattedAmount =
    Number.isSafeInteger(amountValue) && amountValue > 0
      ? amountValue.toLocaleString("en-KE")
      : "0";

  const handleAmountChange = (value) => {
    setAmount(value);
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setPaymentRequest(null);

    if (
      amount.trim() === "" ||
      !Number.isSafeInteger(amountValue) ||
      amountValue < 1
    ) {
      setError("Enter a whole-number amount of at least KSh 1.");
      return;
    }

    if (amountValue > 250000) {
      setError("The maximum amount per request is KSh 250,000.");
      return;
    }

    const normalizedPhone = normalizeKenyanPhone(phone);

    if (!normalizedPhone) {
      setError(
        "Enter a valid Kenyan M-PESA number, for example 0712345678."
      );
      return;
    }

    if (!anonymous && donorName.trim().length > 100) {
      setError("Your name must be 100 characters or fewer.");
      return;
    }

    setLoading(true);

    try {
      const result = await createDonation({
        donorName: anonymous ? "Anonymous" : donorName.trim(),
        phone: normalizedPhone,
        amount: amountValue,
      });

      setPaymentRequest({
        contributionId: result.contributionId,
        message:
          result.customerMessage ||
          result.message ||
          "Payment request submitted. Check your phone for the M-PESA prompt.",
      });
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "We couldn't submit your payment request. Please check your connection and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Page hero */}
      <section className="relative isolate overflow-hidden bg-green-950 px-5 py-16 text-white sm:py-24">
        <div
          aria-hidden="true"
          className="absolute -right-24 -top-24 -z-10 h-80 w-80 rounded-full bg-yellow-400/10 blur-3xl"
        />

        <div className="mx-auto max-w-6xl">
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.22em] text-yellow-400">
            Support our movement
          </p>

          <h1 className="max-w-3xl text-4xl font-extrabold leading-tight sm:text-6xl">
            Every contribution
            <span className="block text-yellow-400">
              makes a difference.
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-7 text-green-100 sm:text-lg">
            Support the activities of the United Democratic Alliance.
            Thank you for being part of our journey.
          </p>

          <div className="mt-8 flex flex-wrap gap-3 text-sm">
            <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2">
              M-PESA payments
            </span>
            <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2">
              Payment confirmation
            </span>
          </div>
        </div>
      </section>

      {/* Donation content */}
      <section className="px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-9">
            {paymentRequest ? (
              <div role="status" aria-live="polite">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 text-2xl text-amber-800">
                  !
                </div>

                <h2 className="mt-5 text-2xl font-bold text-slate-900">
                  Payment request submitted
                </h2>

                <p className="mt-3 leading-7 text-slate-600">
                  {paymentRequest.message}
                </p>

                <p className="mt-4 rounded-xl bg-amber-50 p-4 text-sm leading-6 text-amber-900">
                  Your donation is not yet confirmed as paid. Follow
                  the M-PESA prompt and wait for the payment result.
                  Do not submit another request just because the
                  confirmation is delayed.
                </p>

                <button
                  type="button"
                  onClick={() => setPaymentRequest(null)}
                  className="mt-6 rounded-xl bg-green-800 px-5 py-3 font-bold text-white transition hover:bg-green-900 focus:outline-none focus:ring-2 focus:ring-green-700 focus:ring-offset-2"
                >
                  Return to donation form
                </button>
              </div>
            ) : (
              <>
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-slate-900">
                    Make a contribution
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Select an amount and enter the details needed
                    to request an M-PESA payment.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <fieldset>
                    <legend className="mb-3 text-sm font-bold text-slate-800">
                      Choose an amount
                    </legend>

                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                      {PRESET_AMOUNTS.map((preset) => {
                        const selected = amount === String(preset);

                        return (
                          <button
                            key={preset}
                            type="button"
                            aria-pressed={selected}
                            onClick={() =>
                              handleAmountChange(String(preset))
                            }
                            className={`rounded-xl border px-3 py-4 text-sm font-bold transition focus:outline-none focus:ring-2 focus:ring-green-700 focus:ring-offset-2 ${
                              selected
                                ? "border-green-800 bg-green-800 text-white"
                                : "border-slate-200 bg-white text-slate-800 hover:border-green-700"
                            }`}
                          >
                            KSh {preset.toLocaleString("en-KE")}
                          </button>
                        );
                      })}
                    </div>
                  </fieldset>

                  <div>
                    <label
                      htmlFor="donation-amount"
                      className="mb-2 block text-sm font-bold text-slate-800"
                    >
                      Custom amount (KSh)
                    </label>

                    <input
                      id="donation-amount"
                      name="amount"
                      type="number"
                      min="1"
                      max="250000"
                      step="1"
                      inputMode="numeric"
                      required
                      value={amount}
                      onChange={(event) =>
                        handleAmountChange(event.target.value)
                      }
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-green-700 focus:ring-2 focus:ring-green-700/20"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="donor-name"
                      className="mb-2 block text-sm font-bold text-slate-800"
                    >
                      Full name{" "}
                      <span className="font-normal text-slate-500">
                        (optional)
                      </span>
                    </label>

                    <input
                      id="donor-name"
                      name="donorName"
                      type="text"
                      autoComplete="name"
                      maxLength={100}
                      value={donorName}
                      disabled={anonymous}
                      onChange={(event) =>
                        setDonorName(event.target.value)
                      }
                      placeholder="Enter your name"
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-green-700 focus:ring-2 focus:ring-green-700/20 disabled:bg-slate-100"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="donor-phone"
                      className="mb-2 block text-sm font-bold text-slate-800"
                    >
                      M-PESA phone number
                    </label>

                    <input
                      id="donor-phone"
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      inputMode="tel"
                      required
                      value={phone}
                      onChange={(event) => setPhone(event.target.value)}
                      placeholder="0712345678"
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-green-700 focus:ring-2 focus:ring-green-700/20"
                    />

                    <p className="mt-2 text-xs leading-5 text-slate-500">
                      Enter a valid Kenyan number registered with
                      M-PESA. Never enter your M-PESA PIN on this site.
                    </p>
                  </div>

                  <label className="flex cursor-pointer items-start gap-3 text-sm leading-6 text-slate-600">
                    <input
                      type="checkbox"
                      checked={anonymous}
                      onChange={(event) =>
                        setAnonymous(event.target.checked)
                      }
                      className="mt-1 h-4 w-4 accent-green-800"
                    />
                    <span>
                      Make my contribution anonymous. My phone number
                      will still be processed to request payment.
                    </span>
                  </label>

                  {error && (
                    <div
                      role="alert"
                      aria-live="assertive"
                      className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-800"
                    >
                      {error}
                    </div>
                  )}

                  <div className="rounded-xl bg-slate-50 p-4">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-sm text-slate-600">
                        Amount
                      </span>
                      <span className="text-xl font-extrabold text-slate-900">
                        KSh {formattedAmount}
                      </span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="flex w-full items-center justify-center rounded-xl bg-green-800 px-5 py-4 font-bold text-white transition hover:bg-green-900 focus:outline-none focus:ring-2 focus:ring-green-700 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading
                      ? "Submitting request..."
                      : "Continue with M-PESA"}
                  </button>

                  <p className="text-center text-xs leading-5 text-slate-500">
                    Your request will be processed by the payment
                    service. Only a confirmed payment counts as a
                    completed contribution.
                  </p>
                </form>
              </>
            )}
          </div>

          {/* Payment information */}
          <aside className="space-y-5">
            <div className="rounded-3xl bg-green-900 p-7 text-white sm:p-9">
              <p className="text-sm font-bold uppercase tracking-widest text-yellow-400">
                How it works
              </p>

              <ol className="mt-7 space-y-6">
                <li className="flex gap-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 font-bold">
                    1
                  </span>
                  <div>
                    <h3 className="font-bold">Choose your amount</h3>
                    <p className="mt-1 text-sm leading-6 text-green-100">
                      Select a suggested amount or enter your own.
                    </p>
                  </div>
                </li>

                <li className="flex gap-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 font-bold">
                    2
                  </span>
                  <div>
                    <h3 className="font-bold">Enter your details</h3>
                    <p className="mt-1 text-sm leading-6 text-green-100">
                      Provide your M-PESA phone number carefully.
                    </p>
                  </div>
                </li>

                <li className="flex gap-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 font-bold">
                    3
                  </span>
                  <div>
                    <h3 className="font-bold">Confirm the payment</h3>
                    <p className="mt-1 text-sm leading-6 text-green-100">
                      Follow the prompt on your phone and confirm
                      the transaction through M-PESA.
                    </p>
                  </div>
                </li>
              </ol>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-7">
              <h3 className="font-bold text-slate-900">
                Thank you for your support
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Keep your M-PESA confirmation message as proof of
                payment. If a payment result is delayed, wait for
                confirmation rather than submitting duplicate requests.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

export default Donate;
