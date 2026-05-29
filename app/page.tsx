import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center px-6 text-center">
        <Card className="w-full border-dashed">
          <CardContent className="space-y-8 p-10">
            <div className="flex justify-center">
              <Logo size="lg" />
            </div>

            <div className="space-y-3">
              <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">
                Music Manager
              </p>

              <h2 className="text-4xl font-bold tracking-tight md:text-6xl">
                Manage, Play, and Queue Your Songs
              </h2>

              <p className="mx-auto max-w-2xl text-muted-foreground">
                Upload songs as admin, organize them into public folders, and
                let users play music through a clean queue-based player.
              </p>
            </div>

            <div className="flex justify-center gap-3">
              <Button>Open Library</Button>
              <Button variant="outline">Admin Upload</Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}