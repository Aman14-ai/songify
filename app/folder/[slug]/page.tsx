import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Disc3, Headphones, Layers } from "lucide-react";

import { connectDB } from "@/lib/db";
import Folder from "@/models/Folder";
import Song from "@/models/Song";
import { Logo } from "@/components/Logo";
import { SongList } from "@/components/songs/SongList";
import { Button } from "@/components/ui/button";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type FolderPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

async function getFolderWithSongs(slug: string) {
  await connectDB();

  const folder = await Folder.findOne({ slug }).lean();

  if (!folder) return null;

  const songs = await Song.find({ folderId: folder._id })
    .sort({ createdAt: -1 })
    .lean();

  return {
    folder: {
      _id: folder._id.toString(),
      name: folder.name,
      slug: folder.slug,
      cloudinaryFolderPath: folder.cloudinaryFolderPath,
      createdAt: folder.createdAt.toISOString(),
    },
    songs: songs.map((song: any) => ({
      _id: song._id.toString(),
      title: song.title,
      audioUrl: song.audioUrl,
      duration: song.duration || 0,
      playCount: song.playCount || 0,
      createdAt: song.createdAt.toISOString(),
    })),
  };
}

export default async function FolderDetailsPage({ params }: FolderPageProps) {
  const { slug } = await params;
  const data = await getFolderWithSongs(slug);

  if (!data) notFound();

  const { folder, songs } = data;

  const totalDuration = songs.reduce((acc, s) => acc + (s.duration || 0), 0);
  const totalMins = Math.floor(totalDuration / 60);

  return (
    <main className="folder-page mx-auto min-h-screen max-w-6xl px-6 py-8">
      {/* ── Header ── */}
      <header className="mb-12 flex items-center justify-between">
        <Logo />
        <Link href="/library">
          <Button
            variant="ghost"
            className="group gap-2 rounded-full border border-border/60 bg-background/60 px-5 text-sm font-medium backdrop-blur transition-all hover:border-primary/50 hover:bg-primary/8"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            Library
          </Button>
        </Link>
      </header>

      {/* ── Hero ── */}
      <section className="folder-hero mb-14 grid gap-10 lg:grid-cols-[340px_1fr] lg:items-end">
        {/* Artwork */}
        <div className="folder-artwork-wrap relative mx-auto w-full max-w-[340px] lg:mx-0">
          {/* Stacked shadow discs */}
          <div
            aria-hidden
            className="absolute -bottom-3 -right-3 h-full w-full rounded-[2.5rem] bg-primary/20 blur-sm"
          />
          <div
            aria-hidden
            className="absolute -bottom-1.5 -right-1.5 h-full w-full rounded-[2.5rem] bg-primary/10"
          />

          <div className="folder-artwork relative aspect-square overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[oklch(0.22_0.06_285)] via-[oklch(0.28_0.10_300)] to-[oklch(0.20_0.05_285)] shadow-2xl">
            {/* Ambient glow blobs */}
            <div className="pointer-events-none absolute -left-12 -top-12 h-56 w-56 rounded-full bg-primary/30 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-8 -right-8 h-48 w-48 rounded-full bg-chart-2/25 blur-3xl" />

            {/* Vinyl rings */}
            <div className="absolute inset-0 flex items-center justify-center opacity-10">
              {[140, 180, 220, 260].map((size) => (
                <div
                  key={size}
                  className="absolute rounded-full border border-white/40"
                  style={{ width: size, height: size }}
                />
              ))}
            </div>

            {/* Center icon */}
            <div className="relative flex h-full w-full items-center justify-center">
              <div className="folder-disc flex h-32 w-32 items-center justify-center rounded-full bg-background/15 ring-4 ring-primary/30 backdrop-blur-md">
                <Disc3 className="h-16 w-16 text-primary drop-shadow-lg" />
              </div>
            </div>

            {/* Headphones badge */}
            <div className="absolute bottom-5 right-5 flex h-12 w-12 items-center justify-center rounded-full bg-primary shadow-lg shadow-primary/40">
              <Headphones className="h-5 w-5 text-primary-foreground" />
            </div>

            {/* Public badge */}
            <div className="absolute left-5 top-5 rounded-full bg-background/20 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-white/80 backdrop-blur-sm">
              Public
            </div>
          </div>
        </div>

        {/* Meta */}
        <div className="space-y-6 lg:pb-2">
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-primary">
            Folder
          </p>

          <h1 className="folder-title text-5xl font-extrabold leading-none tracking-tight md:text-7xl">
            {folder.name}
          </h1>

          <p className="max-w-md text-base text-muted-foreground">
            Songs uploaded into this folder are public and available to
            everyone.
          </p>

          {/* Stats row */}
          <div className="flex flex-wrap gap-3 pt-1">
            <StatPill icon={<Layers className="h-4 w-4" />} label="Tracks">
              {songs.length}
            </StatPill>
            <StatPill label="Duration">
              {totalMins > 0 ? `${totalMins} min` : "—"}
            </StatPill>
            <StatPill label="Path" mono>
              {folder.cloudinaryFolderPath}
            </StatPill>
          </div>
        </div>
      </section>

      {/* ── Track List ── */}
      <section>
        <div className="mb-6 flex items-baseline gap-4">
          <h2 className="text-2xl font-bold tracking-tight">Tracks</h2>
          <span className="text-sm text-muted-foreground">
            {songs.length} {songs.length === 1 ? "song" : "songs"}
          </span>
        </div>

        <SongList songs={songs} />
      </section>
    </main>
  );
}

/* ── Helpers ── */
function StatPill({
  icon,
  label,
  mono,
  children,
}: {
  icon?: React.ReactNode;
  label: string;
  mono?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2 rounded-2xl border border-border/60 bg-card/70 px-4 py-2.5 backdrop-blur-sm">
      {icon && <span className="text-primary">{icon}</span>}
      <div>
        <p
          className={`text-sm font-semibold leading-none ${mono ? "break-all font-mono text-xs text-muted-foreground" : ""}`}
        >
          {children}
        </p>
        {!mono && (
          <p className="mt-0.5 text-xs text-muted-foreground">{label}</p>
        )}
        {mono && (
          <p className="mb-0.5 text-xs font-normal text-muted-foreground">
            {label}
          </p>
        )}
      </div>
    </div>
  );
}