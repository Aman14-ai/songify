import Link from "next/link";
import { FolderX } from "lucide-react";

import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function FolderNotFoundPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-6 py-8">
      <Card className="w-full">
        <CardContent className="flex flex-col items-center gap-5 p-10 text-center">
          <Logo size="lg" />

          <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-muted">
            <FolderX className="h-8 w-8 text-muted-foreground" />
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Folder not found</h1>

            <p className="text-muted-foreground">
              This folder does not exist or may have been removed.
            </p>
          </div>

          <Button>
            <Link href="/library">Back to Library</Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}