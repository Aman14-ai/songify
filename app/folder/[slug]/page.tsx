import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, Library, Music2, Settings } from "lucide-react";

import { connectDB } from "@/lib/db";
import Folder from "@/models/Folder";
import Song from "@/models/Song";
import { Logo } from "@/components/Logo";
import { SongList } from "@/components/songs/SongList";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type FolderPageProps = {
  params: Promise<{ slug: string }>;
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

function formatDuration(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);

  if (mins <= 0) return `${secs}s`;

  return `${mins}:${String(secs).padStart(2, "0")}`;
}

export default async function FolderDetailsPage({ params }: FolderPageProps) {
  const { slug } = await params;
  const data = await getFolderWithSongs(slug);

  if (!data) notFound();

  const { folder, songs } = data;

  const totalDuration = songs.reduce((acc, song) => {
    return acc + (song.duration || 0);
  }, 0);

  const folderCreatedAt = new Date(folder.createdAt).toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    }
  );

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-5xl px-5 pb-20 pt-6 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="mb-10 flex items-center justify-between gap-4">
          <Logo />

          <div className="flex items-center gap-2">
            <Link
              href="/library"
              className="inline-flex items-center gap-2 rounded-full border bg-background px-4 py-2 text-sm text-muted-foreground transition-all hover:bg-muted hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Library
            </Link>

            <Link
              href="/admin"
              className="hidden items-center gap-2 rounded-full border bg-background px-4 py-2 text-sm text-muted-foreground transition-all hover:bg-muted hover:text-foreground sm:inline-flex"
            >
              <Settings className="h-4 w-4" />
              Manage
            </Link>
          </div>
        </header>


        {/* Track List */}
        <section className="rounded-[2rem] border bg-card p-4 shadow-sm sm:p-6">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">
                Tracks
              </p>
              <h2 className="mt-2 text-2xl font-bold">Now Playing Library</h2>
            </div>

            <span className="w-fit rounded-full border bg-background px-3 py-1 text-xs tabular-nums text-muted-foreground">
              {songs.length} {songs.length === 1 ? "song" : "songs"}
            </span>
          </div>

          {songs.length === 0 ? (
            <div className="flex min-h-72 flex-col items-center justify-center rounded-[1.5rem] border border-dashed bg-background/60 p-8 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
                <Music2 className="h-8 w-8 text-muted-foreground" />
              </div>

              <h3 className="text-xl font-semibold">No songs in this folder</h3>

              <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
                Songs uploaded to this folder will appear here.
              </p>

              <Link
                href="/admin"
                className="mt-5 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm text-muted-foreground transition-all hover:bg-muted hover:text-foreground"
              >
                <Settings className="h-4 w-4" />
                Manage Library
              </Link>
            </div>
          ) : (
            <SongList songs={songs} />
          )}
        </section>
      </div>
    </main>
  );
}