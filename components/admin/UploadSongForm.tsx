"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Music2, Upload } from "lucide-react";
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
  slug: string;
  cloudinaryFolderPath: string;
};

type UploadSongFormProps = {
  folders: FolderItem[];
};

type CloudinarySignResponse = {
  success: boolean;
  message?: string;
  signature: string;
  timestamp: number;
  folder: string;
  apiKey: string;
  cloudName: string;
};

type CloudinaryUploadResponse = {
  secure_url: string;
  public_id: string;
  duration?: number;
  original_filename?: string;
  resource_type?: string;
};

export function UploadSongForm({ folders }: UploadSongFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [title, setTitle] = useState("");
  const [folderId, setFolderId] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const selectedFolder = folders.find((folder) => folder._id === folderId);

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) {
      setFile(null);
      return;
    }

    const isAudio =
      selectedFile.type.startsWith("audio/") ||
      selectedFile.name.toLowerCase().endsWith(".mp3");

    if (!isAudio) {
      toast.error("Please select an audio file");
      event.target.value = "";
      setFile(null);
      return;
    }

    setFile(selectedFile);

    if (!title.trim()) {
      const cleanName = selectedFile.name.replace(/\.[^/.]+$/, "");
      setTitle(cleanName);
    }
  }

  async function getCloudinarySignature(folderPath: string) {
    const response = await fetch("/api/cloudinary/sign", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ folder: folderPath }),
    });

    const data: CloudinarySignResponse = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Failed to create upload signature");
    }

    return data;
  }

  async function uploadToCloudinary(
    selectedFile: File,
    signData: CloudinarySignResponse
  ) {
    const formData = new FormData();

    formData.append("file", selectedFile);
    formData.append("api_key", signData.apiKey);
    formData.append("timestamp", String(signData.timestamp));
    formData.append("signature", signData.signature);
    formData.append("folder", signData.folder);

    const uploadUrl = `https://api.cloudinary.com/v1_1/${signData.cloudName}/video/upload`;

    const response = await fetch(uploadUrl, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.error?.message || "Cloudinary upload failed");
    }

    return data as CloudinaryUploadResponse;
  }

  async function saveSongToMongoDB(uploadData: CloudinaryUploadResponse) {
    const response = await fetch("/api/songs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: title.trim(),
        folderId,
        audioUrl: uploadData.secure_url,
        cloudinaryPublicId: uploadData.public_id,
        duration: Math.round(uploadData.duration || 0),
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Failed to save song");
    }

    return data;
  }

  async function handleUpload(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!title.trim()) {
      toast.error("Song title is required");
      return;
    }

    if (!selectedFolder) {
      toast.error("Please select a folder");
      return;
    }

    if (!file) {
      toast.error("Please choose an audio file");
      return;
    }

    try {
      setIsUploading(true);

      toast.loading("Preparing secure upload...", {
        id: "song-upload",
      });

      const signData = await getCloudinarySignature(
        selectedFolder.cloudinaryFolderPath
      );

      toast.loading("Uploading song to Cloudinary...", {
        id: "song-upload",
      });

      const uploadData = await uploadToCloudinary(file, signData);

      toast.loading("Saving song in MongoDB...", {
        id: "song-upload",
      });

      await saveSongToMongoDB(uploadData);

      toast.success("Song uploaded successfully", {
        id: "song-upload",
      });

      setTitle("");
      setFolderId("");
      setFile(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      router.refresh();
    } catch (error: any) {
      console.error("Upload song error:", error);

      toast.error(error?.message || "Upload failed", {
        id: "song-upload",
      });
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <Card className="pb-25">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Upload Song
        </CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleUpload} className="space-y-5">
          <div className="space-y-2">
            <Label>Song Title</Label>
            <Input
              placeholder="Example: Iktara"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              disabled={isUploading}
            />
          </div>

          <div className="space-y-2">
            <Label>Select Folder</Label>

            <Select
              value={folderId}
              onValueChange={setFolderId}
              disabled={isUploading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose folder" />
              </SelectTrigger>

              <SelectContent>
                {folders.map((folder) => (
                  <SelectItem key={folder._id} value={folder._id}>
                    {folder.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {selectedFolder && (
              <p className="break-all text-xs text-muted-foreground">
                Cloudinary path: {selectedFolder.cloudinaryFolderPath}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Audio File</Label>

            <Input
              ref={fileInputRef}
              type="file"
              accept="audio/*,.mp3"
              onChange={handleFileChange}
              disabled={isUploading}
            />

            {file && (
              <div className="flex items-center gap-2 rounded-xl bg-muted px-3 py-2 text-sm text-muted-foreground">
                <Music2 className="h-4 w-4" />
                <span className="line-clamp-1">{file.name}</span>
              </div>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isUploading}>
            {isUploading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" />
                Upload Song
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}