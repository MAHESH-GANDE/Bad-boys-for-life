"use client";

export function AccountLogoutButton() {
  return (
    <button
      type="button"
      className="w-full border border-bb-off/20 py-2.5 text-[10px] tracking-[0.2em] text-bb-off/50 hover:border-bb-off/40 hover:text-bb-off"
      onClick={async () => {
        await fetch("/api/auth/otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ action: "logout" }),
        });
        window.location.href = "/account";
      }}
    >
      LOGOUT
    </button>
  );
}
