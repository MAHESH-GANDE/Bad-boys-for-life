import { cn } from "@/lib/utils";

/** Original BADBOYS skull + crossed bones. Not a Unicode glyph. */
export function SkullMark({
  className,
  title = "BADBOYS",
}: {
  className?: string;
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 80 96"
      className={cn("fill-current", className)}
      role="img"
      aria-label={title}
    >
      <title>{title}</title>
      <path
        fillRule="evenodd"
        d="M40 2c16.6 0 30 12.8 30 30.2 0 6.4-1.7 12.2-4.6 16.8v8.4c0 9.6-8.2 17.6-25.4 17.6S14.6 67 14.6 57.4v-8.4C11.7 44.4 10 38.6 10 32.2 10 14.8 23.4 2 40 2Zm-11.2 28.6c0-4.4 3.2-8 7.2-8s7.2 3.6 7.2 8-3.2 8.2-7.2 8.2-7.2-3.8-7.2-8.2Zm16 0c0-4.4 3.2-8 7.2-8s7.2 3.6 7.2 8-3.2 8.2-7.2 8.2-7.2-3.8-7.2-8.2ZM40 41.4 35.8 52h8.4L40 41.4ZM31 56.4h5.2v7.2H31zm6.8 0h4.4v7.2h-4.4zm6.2 0H49v7.2h-5zm6.8 0h5.2v7.2h-5.2zM18.2 78.2c-6.6 4.4-13.2 6-18.2 4.6C6 91 16.8 96.8 28.6 99.4 32 105.8 38.4 110 40 111.2 41.6 110 48 105.8 51.4 99.4 63.2 96.8 74 91 80 82.8c-5 1.4-11.6-.2-18.2-4.6-3.2 6-11.2 10.4-21.8 10.4s-18.6-4.4-21.8-10.4Zm-14.4 8.4 16.8-22.4 6.4 4.8-16.8 22.4-11.2-1.6 4.8-3.2Zm72.4 0-16.8-22.4-6.4 4.8 16.8 22.4 11.2-1.6-4.8-3.2Z"
      />
    </svg>
  );
}

export function Wordmark({ className, spaced = true }: { className?: string; spaced?: boolean }) {
  return (
    <span className={cn("font-display tracking-[0.28em] uppercase", className)}>
      {spaced ? "B A D B O Y S" : "BADBOYS"}
    </span>
  );
}
