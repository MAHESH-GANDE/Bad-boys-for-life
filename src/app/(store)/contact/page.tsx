export default function Page() {
  return (
    <article className="mx-auto max-w-xl px-4 py-16">
      <h1 className="font-display text-4xl tracking-[0.14em]">CONTACT</h1>
      <p className="mt-4 text-bb-off/60">Order, payment, delivery, return, product, or other.</p>
      <form action="/api/support" method="post" className="mt-8 space-y-3">
        <select name="topic" className="w-full border border-bb-off/20 bg-bb-black px-3 py-3">
          {["Order issue","Payment issue","Delivery issue","Return issue","Product issue","Other"].map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
        <input name="mobile" placeholder="Mobile" className="w-full border border-bb-off/20 bg-transparent px-3 py-3" />
        <textarea name="message" placeholder="Message" className="h-32 w-full border border-bb-off/20 bg-transparent px-3 py-3" />
        <button className="bg-bb-off px-6 py-3 text-xs tracking-[0.2em] text-bb-black">SEND</button>
      </form>
      <p className="mt-6 text-sm text-bb-off/50">WhatsApp placeholder: add WHATSAPP credentials to connect Business API.</p>
    </article>
  );
}
