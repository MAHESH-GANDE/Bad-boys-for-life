import { prisma } from "@/lib/db";

export default async function Page() {
  const faqs = await prisma.faq.findMany({ where: { published: true }, orderBy: { sortOrder: "asc" } });
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
  return (
    <article className="mx-auto max-w-3xl px-4 py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <h1 className="font-display text-4xl tracking-[0.14em]">FAQ</h1>
      <div className="mt-10 divide-y divide-bb-off/15">
        {faqs.map((f) => (
          <details key={f.id} className="py-4">
            <summary className="cursor-pointer">{f.question}</summary>
            <p className="mt-2 text-sm text-bb-off/70">{f.answer}</p>
          </details>
        ))}
      </div>
    </article>
  );
}
