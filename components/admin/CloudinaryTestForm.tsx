"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type FolderItem = {
  _id: string;
  name: string;
  cloudinaryFolderPath: string;
};

type CloudinaryTestFormProps = {
  folders: FolderItem[];
};

export function CloudinaryTestForm({ folders }: CloudinaryTestFormProps) {
  const [folderPath, setFolderPath] = useState("");
  const [result, setResult] = useState<any>(null);
  const [isTesting, setIsTesting] = useState(false);

  async function testSignature() {
    if (!folderPath) {
      toast.error("Please select a folder");
      return;
    }

    try {
      setIsTesting(true);
      setResult(null);

      const response = await fetch("/api/cloudinary/sign", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          folder: folderPath,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        toast.error(data.message || "Failed to generate signature");
        return;
      }

      setResult(data);
      toast.success("Cloudinary signature generated");
    } catch (error) {
      console.error("Cloudinary test error:", error);
      toast.error("Something went wrong");
    } finally {
      setIsTesting(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cloudinary Signature Test</CardTitle>
      </CardHeader>

      <CardContent className="space-y-5">
        <div className="space-y-2">
          <p className="text-sm font-medium">Select Folder</p>

          <Select value={folderPath} onValueChange={setFolderPath}>
            <SelectTrigger>
              <SelectValue placeholder="Choose folder" />
            </SelectTrigger>

            <SelectContent>
              {folders.map((folder) => (
                <SelectItem
                  key={folder._id}
                  value={folder.cloudinaryFolderPath}
                >
                  {folder.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button onClick={testSignature} disabled={isTesting} className="w-full">
          {isTesting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Testing...
            </>
          ) : (
            "Generate Signature"
          )}
        </Button>

        {result && (
          <pre className="max-h-[360px] overflow-auto rounded-2xl bg-muted p-4 text-xs">
            {JSON.stringify(
              {
                success: result.success,
                folder: result.folder,
                timestamp: result.timestamp,
                cloudName: result.cloudName,
                apiKey: result.apiKey,
                signaturePreview: `${result.signature.slice(0, 12)}...`,
              },
              null,
              2
            )}
          </pre>
        )}
      </CardContent>
    </Card>
  );
}