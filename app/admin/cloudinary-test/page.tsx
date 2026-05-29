import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { connectDB } from "@/lib/db";
import Folder from "@/models/Folder";
import { CloudinaryTestForm } from "@/components/admin/CloudinaryTestForm";

export const runtime = "nodejs";

async function getFolders() {
  await connectDB();

  const folders = await Folder.find({}).sort({ createdAt: -1 }).lean();

  return folders.map((folder: any) => ({
    _id: folder._id.toString(),
    name: folder.name,
    cloudinaryFolderPath: folder.cloudinaryFolderPath,
  }));
}

export default async function CloudinaryTestPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== "admin") {
    redirect("/");
  }

  const folders = await getFolders();

  return (
    <main className="mx-auto min-h-screen max-w-3xl px-6 py-10">
      <div className="mb-8 space-y-2">
        <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">
          Admin / Cloudinary Test
        </p>

        <h1 className="text-4xl font-bold">Test Cloudinary Signature</h1>

        <p className="text-muted-foreground">
          This only checks whether Cloudinary signed upload data is generated.
        </p>
      </div>

      <CloudinaryTestForm folders={folders} />
    </main>
  );
}