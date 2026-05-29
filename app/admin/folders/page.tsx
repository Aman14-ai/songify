import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { auth } from "@/auth";
import { connectDB } from "@/lib/db";
import Folder from "@/models/Folder";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { CreateFolderForm } from "@/components/admin/CreateFolderForm";
import { FolderList } from "@/components/admin/FolderList";

export const runtime = "nodejs";

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

export default async function AdminFoldersPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }


  const folders = await getFolders();

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-6 py-8">
      <header className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <Logo />

        <Button variant="outline">
          <Link href="/admin">
            <ArrowLeft className="h-4 w-4" />
            Back to Admin
          </Link>
        </Button>
      </header>

      <section className="mb-8 space-y-2">
        <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">
          Admin / Folders
        </p>

        <h1 className="text-4xl font-bold tracking-tight">
          Manage Song Folders
        </h1>

        <p className="max-w-2xl text-muted-foreground">
          Create public folders for songs. Later, the admin upload page will let
          you upload songs directly into one of these folders.
        </p>
      </section>

      <section className="grid gap-6 lg:grid-cols-[380px_1fr]">
        <CreateFolderForm />
        <FolderList folders={folders} />
      </section>
    </main>
  );
}