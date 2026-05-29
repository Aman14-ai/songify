import { FileMusic, Music2 } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type FolderItem = {
  _id: string;
  name: string;
  slug: string;
  cloudinaryFolderPath: string;
  createdAt: string;
};

type FolderListProps = {
  folders: FolderItem[];
};

export function FolderList({ folders }: FolderListProps) {
  if (folders.length === 0) {
    return (
      <Card>
        <CardContent className="flex min-h-65 flex-col items-center justify-center gap-4 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-muted">
            <FileMusic className="h-8 w-8 text-muted-foreground" />
          </div>

          <div className="space-y-1">
            <h2 className="text-xl font-semibold">No folders yet</h2>
            <p className="max-w-sm text-sm text-muted-foreground">
              Create your first folder. Later, uploaded songs will be grouped
              inside these folders.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Folders</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {folders.map((folder) => (
            <div
              key={folder._id}
              className="group rounded-2xl border bg-card p-4 transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="mb-4 flex h-32 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 via-accent to-secondary">
                <Music2 className="h-12 w-12 text-primary" />
              </div>

              <div className="space-y-3">
                <div>
                  <h3 className="text-lg font-semibold">{folder.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    /folder/{folder.slug}
                  </p>
                </div>

                <div className="space-y-2">
                  <Badge variant="secondary">Public</Badge>

                  <p className="break-all rounded-xl bg-muted px-3 py-2 text-xs text-muted-foreground">
                    {folder.cloudinaryFolderPath}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}