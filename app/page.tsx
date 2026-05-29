import Link from "next/link";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  const features = [
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" />
        </svg>
      ),
      title: "Queue-Based Playback",
      desc: "Seamless song queuing with a clean, distraction-free player interface.",
    },
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" /><path d="M16 3v4M8 3v4M3 11h18" />
        </svg>
      ),
      title: "Public Folders",
      desc: "Organize music into shared folders that anyone can browse and discover.",
    },
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 16v-4M12 8h.01" /><circle cx="12" cy="12" r="10" />
        </svg>
      ),
      title: "Admin Dashboard",
      desc: "Upload, manage, and curate songs with full admin controls.",
    },
  ];

  return (
    <main className="relative min-h-screen overflow-hidden bg-background text-foreground">

      {/* ── Ambient background layers ── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background: `
            radial-gradient(ellipse 70% 55% at 10% -5%, oklch(0.68 0.24 300 / 22%) 0%, transparent 60%),
            radial-gradient(ellipse 55% 45% at 90% 100%, oklch(0.7 0.18 190 / 16%) 0%, transparent 55%),
            radial-gradient(ellipse 40% 35% at 60% 50%, oklch(0.68 0.24 300 / 8%) 0%, transparent 60%)
          `,
        }}
      />

      {/* ── Decorative waveform bars ── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-0 right-0 -z-10 flex items-end justify-center gap-[3px] opacity-[0.07]"
        style={{ height: "220px" }}
      >
        {Array.from({ length: 72 }).map((_, i) => {
          const heights = [18, 32, 55, 80, 64, 90, 110, 78, 48, 62, 95, 115, 88, 60, 40, 72, 100, 85, 50, 30, 45, 70, 105, 92, 66, 38, 56, 82, 118, 76, 44, 26, 58, 96, 112, 74, 42, 28, 52, 84, 108, 68, 36, 20, 48, 76, 100, 88, 54, 32];
          const h = heights[i % heights.length];
          return (
            <div
              key={i}
              className="w-[5px] rounded-t-sm bg-primary"
              style={{ height: `${h}px` }}
            />
          );
        })}
      </div>

      {/* ── Nav ── */}
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Logo size="sm" />
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm"  >
            <Link href="/admin">Admin</Link>
          </Button>
          <Button size="sm"  >
            <Link href="/library">Open Library</Link>
          </Button>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="mx-auto flex max-w-5xl flex-col items-center px-6 pb-12 pt-16 text-center md:pt-24">

        {/* Eyebrow pill */}
        <div
          className="mb-7 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/8 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-primary"
          style={{ backdropFilter: "blur(6px)" }}
        >
          <span
            className="inline-block h-1.5 w-1.5 rounded-full bg-primary"
            style={{ animation: "pulse 2s ease-in-out infinite" }}
          />
          Music Manager
        </div>

        {/* Headline */}
        <h1
          className="mb-6 max-w-3xl text-5xl font-bold leading-[1.12] tracking-tight md:text-7xl"
          style={{ letterSpacing: "-0.03em" }}
        >
          Your music.
          <br />
          <span
            className="bg-clip-text text-transparent"
            style={{
              backgroundImage:
                "linear-gradient(135deg, oklch(0.68 0.24 300), oklch(0.7 0.18 190))",
            }}
          >
            Beautifully organised.
          </span>
        </h1>

        {/* Sub */}
        <p className="mb-10 max-w-xl text-lg leading-relaxed text-muted-foreground">
          Upload songs as admin, organise them into public folders, and let
          anyone listen through a clean queue-based player.
        </p>

        {/* CTAs */}
        <div className="flex flex-col items-center gap-3 sm:flex-row">
          <Button size="lg" className="min-w-[160px] text-base shadow-lg shadow-primary/25"  >
            <Link href="/library">
              Open Library
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="min-w-[160px] text-base"  >
            <Link href="/admin">Admin Dashboard</Link>
          </Button>
        </div>

        {/* Social proof row */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground">
          {["Queue-based playback", "Admin uploads", "Public folders", "Clean UI"].map((item) => (
            <span key={item} className="flex items-center gap-1.5">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              {item}
            </span>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="grid gap-4 md:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card/60 p-7 transition-all duration-300 hover:border-primary/30 hover:bg-card/90 hover:shadow-xl hover:shadow-primary/10"
              style={{ backdropFilter: "blur(10px)" }}
            >
              {/* Subtle hover glow */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{
                  background:
                    "radial-gradient(ellipse 80% 60% at 50% -10%, oklch(0.68 0.24 300 / 10%), transparent 70%)",
                }}
              />

              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                {f.icon}
              </div>
              <h3 className="mb-2 text-base font-semibold tracking-tight">
                {f.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Bottom CTA strip ── */}
      <section className="mx-auto max-w-5xl px-6 pb-20">
        <div
          className="relative overflow-hidden rounded-3xl border border-primary/20 px-10 py-14 text-center"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.58 0.22 300 / 12%) 0%, oklch(0.7 0.18 190 / 8%) 100%)",
            backdropFilter: "blur(12px)",
          }}
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 rounded-3xl"
            style={{
              background:
                "radial-gradient(ellipse 70% 80% at 50% 100%, oklch(0.68 0.24 300 / 14%), transparent 60%)",
            }}
          />
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.25em] text-muted-foreground">
            Ready to listen?
          </p>
          <h2 className="mb-6 text-3xl font-bold tracking-tight md:text-4xl">
            Start exploring your library
          </h2>
          <Button size="lg" className="shadow-lg shadow-primary/30"  >
            <Link href="/library">Open Library</Link>
          </Button>
        </div>
      </section>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.85); }
        }
      `}</style>
    </main>
  );
}