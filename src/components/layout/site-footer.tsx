import Link from "next/link";
import { Logo } from "@/components/layout/logo";

export function SiteFooter() {
  return (
    <footer className="border-t border-line-soft bg-foreground/[0.02]">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-14 sm:grid-cols-3 sm:px-10">
        <div>
          <Logo />
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-ink-soft">
            Training Christians to defend the faith with clarity, conviction,
            and grace — always ready to give an answer.
          </p>
          <p className="mt-4 font-display text-sm italic text-ink-soft">
            “…you will be my witnesses… to the end of the earth.” — Acts 1:8
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ink-soft">
            Explore
          </p>
          <ul className="mt-4 flex flex-col gap-2.5 text-sm">
            <li><Link href="/about" className="text-ink-soft transition-colors hover:text-foreground">Why Witness Ready exists</Link></li>
            <li><Link href="/training" className="text-ink-soft transition-colors hover:text-foreground">The training catalog</Link></li>
            <li><Link href="/how-it-works" className="text-ink-soft transition-colors hover:text-foreground">How training works</Link></li>
            <li><Link href="/beliefs" className="text-ink-soft transition-colors hover:text-foreground">What we believe</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ink-soft">
            Begin
          </p>
          <ul className="mt-4 flex flex-col gap-2.5 text-sm">
            <li><Link href="/signup" className="text-ink-soft transition-colors hover:text-foreground">Create an account</Link></li>
            <li><Link href="/login" className="text-ink-soft transition-colors hover:text-foreground">Sign in</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line-soft py-5 text-center text-xs text-ink-soft">
        © {new Date().getFullYear()} Witness Ready · Scripture quotations are from the ESV® Bible, used by permission.
      </div>
    </footer>
  );
}
