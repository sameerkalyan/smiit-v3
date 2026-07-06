import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 text-center">
      <span className="text-8xl md:text-[10rem] font-mono font-bold text-[var(--ink)]/[0.08] leading-none select-none">
        404
      </span>
      <h1 className="text-2xl md:text-3xl font-mono font-bold uppercase tracking-tight text-[var(--ink)] mt-[-2rem]">
        Page not found
      </h1>
      <p className="text-sm font-mono text-[var(--ink2)] mt-4 max-w-md leading-relaxed">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        href="/"
        className="brutalist-cta inline-flex mt-8"
      >
        <span className="brutalist-cta-icon h-9" style={{ background: "var(--pa2)", color: "var(--ink)" }}>
          ←
        </span>
        <span className="brutalist-cta-label text-[10px]">BACK TO HOME</span>
      </Link>
    </div>
  );
}
