import Link from "next/link";
import { Headphones, Library, LogIn } from "lucide-react";

import { connectDB } from "@/lib/db";
import Folder from "@/models/Folder";
import { Logo } from "@/components/Logo";
import { FolderCard } from "@/components/folders/FolderCard";
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
    createdAt: folder.createdAt.toISOString(),
  }));
}

export default async function LibraryPage() {
  const folders = await getFolders();

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-6 py-8">
      {/* ── Nav ── */}
      <header className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <Logo />
        <div className="flex gap-3">
          <Button asChild variant="outline">
            <Link className="flex items-center gap-2" href="/login">
              <LogIn className="h-4 w-4" />
              Admin Login
            </Link>
          </Button>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="mb-12 grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <div className="space-y-5">
          <div className="inline-flex items-center gap-2 rounded-full border bg-background/70 px-4 py-2 text-sm text-muted-foreground backdrop-blur">
            <Headphones className="h-4 w-4" />
            Public Music Library
          </div>
          <div className="space-y-3">
            <h1 className="max-w-3xl text-4xl font-bold tracking-tight md:text-6xl">
              Listen from your organised song folders.
            </h1>
            <p className="max-w-2xl text-muted-foreground md:text-lg">
              Browse all public folders created by the admin. Pick a folder and
              start listening.
            </p>
          </div>
        </div>
      </section>

      {/* ── Folder list ── */}
      <section className="space-y-5">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">
            Folders
          </p>
          <h2 className="mt-2 text-3xl font-bold">Explore Library</h2>
        </div>

        {folders.length === 0 ? (
          <Card>
            <CardContent className="flex min-h-80 flex-col items-center justify-center gap-4 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-muted">
                <Library className="h-8 w-8 text-muted-foreground" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-semibold">No folders available yet</h3>
                <p className="max-w-sm text-sm text-muted-foreground">
                  Once admin creates folders, they will appear here for everyone.
                </p>
              </div>
              <Button variant="outline" asChild>
                <Link href="/admin/folders">Create Folder as Admin</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="flex flex-col gap-3">
            {folders.map((folder, i) => (
              <FolderCard key={folder._id} folder={folder} index={i} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}