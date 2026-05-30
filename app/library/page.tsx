import Link from "next/link";
import {
  ChevronRight,
  FolderOpen,
  Headphones,
  Library,
  LogIn,
  Music2,
  Sparkles,
} from "lucide-react";

import { connectDB } from "@/lib/db";
import Folder from "@/models/Folder";
import { Logo } from "@/components/Logo";
import { FolderCard } from "@/components/folders/FolderCard";
import { Button } from "@/components/ui/button";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type FolderItem = {
  _id: string;
  name: string;
  slug: string;
  cloudinaryFolderPath: string;
  createdAt: string;
};

async function getFolders(): Promise<FolderItem[]> {
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
    <main className="relative min-h-screen overflow-hidden bg-background text-foreground">
      {/* Background texture */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 opacity-[0.035]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg,currentColor,currentColor 1px,transparent 1px,transparent 42px)," +
            "repeating-linear-gradient(90deg,currentColor,currentColor 1px,transparent 1px,transparent 42px)",
        }}
      />

      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top,var(--color-muted),transparent_38%)]/45" />

      <div className="mx-auto max-w-6xl px-5 py-6 sm:px-6 lg:px-8">
        {/* Nav */}
        <header className="mb-14 flex items-center justify-between gap-4">
          <Logo />

          <Button
            
            variant="ghost"
            size="sm"
            className="h-9 rounded-full border border-border/60 bg-background/60 px-4 text-xs font-medium text-muted-foreground backdrop-blur transition-all hover:border-border hover:bg-muted/50 hover:text-foreground"
          >
            <Link href="/admin" className="flex items-center gap-2">
              <LogIn className="h-3.5 w-3.5" />
              Admin
            </Link>
          </Button>
        </header>


        {/* Section title */}
        <div className="mb-7 flex items-center gap-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-muted-foreground/70">
              Folders
            </p>
            <h2 className="mt-2 text-2xl font-bold">Explore Library</h2>
          </div>

          <div className="hidden h-px flex-1 bg-border/60 sm:block" />

          {folders.length > 0 && (
            <span className="hidden rounded-full border border-border/60 bg-background/70 px-3 py-1 text-xs tabular-nums text-muted-foreground sm:inline-flex">
              {folders.length} {folders.length === 1 ? "folder" : "folders"}
            </span>
          )}
        </div>

        {/* Folder list */}
        <section>
          {folders.length === 0 ? (
            <div className="flex min-h-80 flex-col items-center justify-center gap-5 rounded-[2rem] border border-dashed border-border/70 bg-muted/20 px-6 py-16 text-center shadow-sm">
              <div className="flex h-16 w-16 items-center justify-center rounded-3xl border border-border/60 bg-background">
                <Library className="h-7 w-7 text-muted-foreground" />
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-semibold">No folders yet</h3>
                <p className="max-w-sm text-sm leading-6 text-muted-foreground">
                  Once folders are created, they will appear here for everyone
                  to explore.
                </p>
              </div>

              <Button
                variant="outline"
                size="sm"
                className="h-9 rounded-full px-4"
              >
                <Link href="/admin/folders" className="flex items-center gap-2">
                  Create as Admin
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {folders.map((folder, i) => (
                <FolderCard key={folder._id} folder={folder} index={i} />
              ))}
            </div>
          )}
        </section>

        {/* Footer */}
        <footer className="mt-20 flex items-center justify-between border-t border-border/50 pt-7">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Music2 className="h-3.5 w-3.5" />
            <span>Music Library</span>
          </div>

          <p className="text-xs text-muted-foreground">
            {new Date().getFullYear()}
          </p>
        </footer>
      </div>
    </main>
  );
}