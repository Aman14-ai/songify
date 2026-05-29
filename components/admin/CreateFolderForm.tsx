"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FolderPlus, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function CreateFolderForm() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  async function handleCreateFolder(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedName = name.trim();

    if (!trimmedName) {
      toast.error("Folder name is required");
      return;
    }

    if (trimmedName.length < 2) {
      toast.error("Folder name must be at least 2 characters");
      return;
    }

    try {
      setIsCreating(true);

      const response = await fetch("/api/folders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: trimmedName,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        toast.error(data.message || "Failed to create folder");
        return;
      }

      toast.success("Folder created successfully");
      setName("");
      router.refresh();
    } catch (error) {
      console.error("Create folder error:", error);
      toast.error("Something went wrong");
    } finally {
      setIsCreating(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FolderPlus className="h-5 w-5" />
          Create New Folder
        </CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleCreateFolder} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="folderName">Folder Name</Label>
            <Input
              id="folderName"
              placeholder="Example: Romantic Songs"
              value={name}
              onChange={(event) => setName(event.target.value)}
              disabled={isCreating}
            />
          </div>

          <Button type="submit" disabled={isCreating} className="w-full">
            {isCreating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <FolderPlus className="h-4 w-4" />
                Create Folder
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}