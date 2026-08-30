"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatInr } from "@/lib/utils";
import { normalizeMobileInput, normalizeOtpInput } from "@/lib/validations";

export function CheckoutClient({
  subtotal,
  loggedIn,
  mobile,
  couponCode: initialCoupon,
  couponDiscount: initialDiscount,
}: {
  subtotal: number;
  loggedIn: boolean;
  mobile?: string;
  couponCode?: string;
  couponDiscount?: number;
}) {
  const router = useRouter();
  const [step, setStep] = useState(loggedIn ? 2 : 1);
  const [phone, setPhone] = useState(mobile || "");
  const [otp, setOtp] = useState("");
  const [devOtp, setDevOtp] = useState("");
  const [email, setEmail] = useState("");
  const [couponCode, setCouponCode] = useState(initialCoupon || "");
  const [couponDiscount, setCouponDiscount] = useState(initialDiscount ?? 0);
  const [couponMsg, setCouponMsg] = useState(initialCoupon ? `Applied · ${initialCoupon}` : "");
  const [form, setForm] = useState({
    fullName: "",
    mobile: mobile || "",
    house: "",
    street: "",
    landmark: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [method, setMethod] = useState<"STANDARD" | "EXPRESS">("STANDARD");
  const [pay, setPay] = useState<"UPI" | "CARD" | "NETBANKING" | "WALLET" | "COD">("UPI");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function sendOtp() {
    const normalized = normalizeMobileInput(phone);
    if (!/^[6-9]\d{9}$/.test(normalized)) {
      setError("Enter a valid 10-digit mobile number.");
      return;
    }
    const res = await fetch("/api/auth/otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ mobile: normalized, action: "request" }),
    });
    const data = await res.json();
    if (!res.ok) return setError(data.error || "Could not send OTP.");
    setPhone(normalized);
    setDevOtp(data.devOtp || "");
    setError("");
  }

  async function verify() {
    const normalizedMobile = normalizeMobileInput(phone);
    const normalizedOtp = normalizeOtpInput(otp);
    const res = await fetch("/api/auth/otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ mobile: normalizedMobile, action: "verify", code: normalizedOtp }),
    });
    const data = await res.json();
    if (!res.ok) return setError(data.error || "Invalid OTP.");
    setForm((f) => ({ ...f, mobile: normalizedMobile }));
    setStep(2);
    setError("");
  }

  async function applyCoupon() {
    setCouponMsg("");
    const res = await fetch("/api/coupons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ code: couponCode }),
    });
    const data = await res.json();
    if (!res.ok) {
      setCouponMsg(data.error || "Invalid code.");
      setCouponDiscount(0);
      return;
    }
    setCouponDiscount(data.discount);
    setCouponCode(data.code);
    setCouponMsg(`Applied · ${formatInr(data.discount)} off`);
  }

  async function place() {
    setPending(true);
    setError("");
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        email,
        address: form,
        deliveryMethod: method,
        paymentMethod: pay === "UPI" || pay === "CARD" || pay === "NETBANKING" || pay === "WALLET" ? "RAZORPAY" : "COD",
        couponCode: couponCode || undefined,
      }),
    });
    const data = await res.json();
    setPending(false);
    if (!res.ok) return setError(data.error || "Checkout failed");
    if (data.status === "CONFIRMED") {
      router.push(`/order-success?order=${data.orderNumber}`);
      return;
    }
    const confirm = await fetch("/api/payments/webhook", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderNumber: data.orderNumber, success: true }),
    });
    if (!confirm.ok) {
      router.push(`/checkout?failed=1&order=${data.orderNumber}`);
      return;
    }
    router.push(`/order-success?order=${data.orderNumber}`);
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-12">
      <h1 className="font-display text-4xl tracking-[0.16em]">CHECKOUT</h1>
      <div className="mt-2 space-y-1 text-sm text-bb-off/50">
        <p>Bag {formatInr(subtotal)}</p>
        {couponDiscount > 0 && <p className="text-bb-off/70">Coupon −{formatInr(couponDiscount)}</p>}
        <p className="text-bb-off">Total {formatInr(Math.max(0, subtotal - couponDiscount))}</p>
      </div>
      {error && <p className="mt-4 border border-bb-red px-3 py-2 text-sm text-bb-red">{error}</p>}

      {step === 1 && (
        <div className="mt-8 space-y-4">
          <p className="text-[10px] tracking-[0.22em]">STEP 1 · MOBILE</p>
          <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="10-digit mobile" className="w-full border border-bb-off/20 bg-transparent px-3 py-3" />
          <button onClick={sendOtp} className="border border-bb-off px-4 py-2 text-xs tracking-[0.2em]">
            SEND OTP
          </button>
          {devOtp && <p className="text-xs text-bb-off/50">Dev OTP: {devOtp}</p>}
          <input value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="6-digit OTP" className="w-full border border-bb-off/20 bg-transparent px-3 py-3" />
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full border border-bb-off/20 bg-transparent px-3 py-3" />
          <button onClick={verify} className="w-full bg-bb-off py-3 text-xs tracking-[0.24em] text-bb-black">
            CONTINUE
          </button>
        </div>
      )}

      {step >= 2 && (
        <div className="mt-8 space-y-3">
          <p className="text-[10px] tracking-[0.22em]">STEP 2 · ADDRESS</p>
          {(["fullName", "mobile", "house", "street", "landmark", "city", "state", "pincode"] as const).map((k) => (
            <input
              key={k}
              value={form[k]}
              onChange={(e) => setForm({ ...form, [k]: e.target.value })}
              placeholder={k}
              className="w-full border border-bb-off/20 bg-transparent px-3 py-3 capitalize"
            />
          ))}
          <p className="pt-4 text-[10px] tracking-[0.22em]">STEP 3 · DELIVERY</p>
          <label className="flex gap-2 text-sm">
            <input type="radio" checked={method === "STANDARD"} onChange={() => setMethod("STANDARD")} /> Standard
          </label>
          <label className="flex gap-2 text-sm">
            <input type="radio" checked={method === "EXPRESS"} onChange={() => setMethod("EXPRESS")} /> Express
          </label>
          <p className="pt-4 text-[10px] tracking-[0.22em]">STEP 4 · COUPON</p>
          <div className="flex gap-2">
            <input
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              placeholder="COUPON CODE"
              className="flex-1 border border-bb-off/20 bg-transparent px-3 py-2 text-sm"
            />
            <button type="button" onClick={applyCoupon} className="border border-bb-off px-3 text-xs tracking-[0.16em]">
              APPLY
            </button>
          </div>
          {couponMsg && <p className="text-xs text-bb-off/60">{couponMsg}</p>}
          <p className="pt-4 text-[10px] tracking-[0.22em]">STEP 5 · PAYMENT</p>
          {(["UPI", "CARD", "NETBANKING", "WALLET", "COD"] as const).map((m) => (
            <label key={m} className="flex gap-2 text-sm">
              <input type="radio" checked={pay === m} onChange={() => setPay(m)} /> {m}
            </label>
          ))}
          <p className="text-xs text-bb-off/40">Cards are processed by Razorpay. We never store card details. Mock capture is used until keys are added.</p>
          <button disabled={pending} onClick={place} className="mt-4 w-full bg-bb-off py-3 text-xs tracking-[0.24em] text-bb-black">
            {pending ? "PLACING…" : "PLACE ORDER"}
          </button>
        </div>
      )}
    </div>
  );
}
