import { redirect } from "next/navigation";
import Link from "next/link";
import { FolderPlus, Upload, Music2 } from "lucide-react";

import { auth } from "@/auth";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AdminPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-6 py-8">
      <header className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <Logo />

        <div className="text-left sm:text-right">
          <p className="font-medium">{session.user.name}</p>
          <p className="text-sm text-muted-foreground">{session.user.email}</p>
        </div>
      </header>

      <section className="mb-8 space-y-2">
        <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">
          Admin Dashboard
        </p>

        <h1 className="text-4xl font-bold tracking-tight">Manage Songify</h1>

        <p className="max-w-2xl text-muted-foreground">
          Create folders, upload songs, and manage your public music library.
        </p>
      </section>

      <section className="grid gap-5 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FolderPlus className="h-5 w-5" />
              Folders
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Create and manage song folders visible to everyone.
            </p>

            <Button className="w-full">
              <Link href="/admin/folders">Manage Folders</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="opacity-70">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Upload Songs
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Upload songs into folders using Cloudinary.
            </p>

            <Button variant="outline" className="w-full">
              <Link href="/admin/upload">Upload Songs</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="opacity-70">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Music2 className="h-5 w-5" />
              Library
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Public song library and player interface.
            </p>

            <Button variant="outline" className="w-full">
              <Link href="/library">Open Library</Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
