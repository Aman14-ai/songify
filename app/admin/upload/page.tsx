import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, FolderPlus, Upload } from "lucide-react";

import { auth } from "@/auth";
import { connectDB } from "@/lib/db";
import Folder from "@/models/Folder";
import Song from "@/models/Song";
import { Logo } from "@/components/Logo";
import { UploadSongForm } from "@/components/admin/UploadSongForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function getFolders() {
  await connectDB();

  const folders = await Folder.find({}).sort({ createdAt: -1 }).lean();

  return folders.map((folder: any) => ({
    _id: folder._id.toString(),
    name: folder.name,
    slug: folder.slug,
    cloudinaryFolderPath: folder.cloudinaryFolderPath,
  }));
}

async function getRecentSongs() {
  await connectDB();

  const songs = await Song.find({})
    .sort({ createdAt: -1 })
    .limit(6)
    .populate("folderId", "name slug")
    .lean();

  return songs.map((song: any) => ({
    _id: song._id.toString(),
    title: song.title,
    audioUrl: song.audioUrl,
    duration: song.duration || 0,
    playCount: song.playCount || 0,
    folderName: song.folderId?.name || "Unknown Folder",
    folderSlug: song.folderId?.slug || "",
    createdAt: song.createdAt.toISOString(),
  }));
}

function formatDuration(seconds: number) {
  if (!seconds || seconds <= 0) {
    return "--:--";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

export default async function AdminUploadPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== "admin") {
    redirect("/");
  }

  const [folders, recentSongs] = await Promise.all([
    getFolders(),
    getRecentSongs(),
  ]);

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-6 py-8">
      <header className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <Logo />

        <Button  variant="outline">
          <Link href="/admin">
            <ArrowLeft className="h-4 w-4" />
            Back to Admin
          </Link>
        </Button>
      </header>

      <section className="mb-8 space-y-2">
        <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">
          Admin / Upload
        </p>

        <h1 className="text-4xl font-bold tracking-tight">
          Upload Songs
        </h1>

        <p className="max-w-2xl text-muted-foreground">
          Upload MP3/audio files to Cloudinary and save their metadata in
          MongoDB. Uploaded songs will appear inside their selected public
          folder.
        </p>
      </section>

      {folders.length === 0 ? (
        <Card>
          <CardContent className="flex min-h-[320px] flex-col items-center justify-center gap-4 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-muted">
              <FolderPlus className="h-8 w-8 text-muted-foreground" />
            </div>

            <div className="space-y-1">
              <h2 className="text-xl font-semibold">Create a folder first</h2>
              <p className="max-w-sm text-sm text-muted-foreground">
                Songs must be uploaded inside a folder. Create at least one
                folder before uploading music.
              </p>
            </div>

            <Button >
              <Link href="/admin/folders">Create Folder</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <section className="grid gap-6 lg:grid-cols-[420px_1fr]">
          <UploadSongForm folders={folders} />

          <Card>
            <CardContent className="p-6">
              <div className="mb-5 flex items-center gap-2">
                <Upload className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">Recent Uploads</h2>
              </div>

              {recentSongs.length === 0 ? (
                <div className="flex min-h-[260px] flex-col items-center justify-center gap-3 rounded-2xl border border-dashed text-center">
                  <p className="font-medium">No songs uploaded yet</p>
                  <p className="max-w-sm text-sm text-muted-foreground">
                    Upload your first song using the form on the left.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentSongs.map((song) => (
                    <div
                      key={song._id}
                      className="flex items-center justify-between gap-4 rounded-2xl border p-4"
                    >
                      <div className="min-w-0">
                        <h3 className="line-clamp-1 font-semibold">
                          {song.title}
                        </h3>

                        <div className="mt-1 flex flex-wrap gap-2 text-sm text-muted-foreground">
                          <span>{song.folderName}</span>
                          <span>•</span>
                          <span>{formatDuration(song.duration)}</span>
                        </div>
                      </div>

                      {song.folderSlug && (
                        <Button   size="sm" variant="outline">
                          <Link href={`/folder/${song.folderSlug}`}>
                            View
                          </Link>
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </section>
      )}
    </main>
  );
}