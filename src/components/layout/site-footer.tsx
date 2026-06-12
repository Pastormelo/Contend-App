import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-line-soft bg-foreground/[0.02]">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-14 sm:grid-cols-3 sm:px-10">
        <div>
          <p className="font-display text-lg font-semibold tracking-tight">
            Contend
          </p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-ink-soft">
            Training Christians to defend the faith with clarity, conviction,
            and grace — always ready to give an answer.
          </p>
          <p className="mt-4 font-display text-sm italic text-ink-soft">
            “…contend for the faith that was once for all delivered to the
            saints.” — Jude 3
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ink-soft">
            Explore
          </p>
          <ul className="mt-4 flex flex-col gap-2.5 text-sm">
            <li><Link href="/about" className="text-ink-soft transition-colors hover:text-ink">Why Contend exists</Link></li>
            <li><Link href="/training" className="text-ink-soft transition-colors hover:text-ink">The training catalog</Link></li>
            <li><Link href="/how-it-works" className="text-ink-soft transition-colors hover:text-ink">How training works</Link></li>
            <li><Link href="/about#affirms" className="text-ink-soft transition-colors hover:text-ink">What Contend affirms</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ink-soft">
            Begin
          </p>
          <ul className="mt-4 flex flex-col gap-2.5 text-sm">
            <li><Link href="/signup" className="text-ink-soft transition-colors hover:text-ink">Create an account</Link></li>
            <li><Link href="/login" className="text-ink-soft transition-colors hover:text-ink">Sign in</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line-soft py-5 text-center text-xs text-ink-soft">
        © {new Date().getFullYear()} Contend · Scripture quotations are from the ESV® Bible, used by permission.
      </div>
    </footer>
  );
}
