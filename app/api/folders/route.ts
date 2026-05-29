import { NextRequest, NextResponse } from "next/server";
import slugify from "slugify";

import { auth } from "@/auth";
import { connectDB } from "@/lib/db";
import Folder from "@/models/Folder";

export const runtime = "nodejs";

function serializeFolder(folder: any) {
  return {
    _id: folder._id.toString(),
    name: folder.name,
    slug: folder.slug,
    cloudinaryFolderPath: folder.cloudinaryFolderPath,
    createdAt: folder.createdAt,
    updatedAt: folder.updatedAt,
  };
}

function createSlug(name: string) {
  const slug = slugify(name, {
    lower: true,
    strict: true,
    trim: true,
  });

  return slug || `folder-${Date.now()}`;
}

async function createUniqueSlug(name: string) {
  const baseSlug = createSlug(name);
  let slug = baseSlug;
  let counter = 1;

  while (await Folder.exists({ slug })) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
}

export async function GET() {
  try {
    await connectDB();

    const folders = await Folder.find({})
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      folders: folders.map((folder: any) => ({
        _id: folder._id.toString(),
        name: folder.name,
        slug: folder.slug,
        cloudinaryFolderPath: folder.cloudinaryFolderPath,
        createdAt: folder.createdAt,
        updatedAt: folder.updatedAt,
      })),
    });
  } catch (error) {
    console.error("GET /api/folders error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch folders",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    

    const body = await request.json();
    const name = String(body.name || "").trim();

    if (!name) {
      return NextResponse.json(
        {
          success: false,
          message: "Folder name is required",
        },
        { status: 400 }
      );
    }

    if (name.length < 2) {
      return NextResponse.json(
        {
          success: false,
          message: "Folder name must be at least 2 characters",
        },
        { status: 400 }
      );
    }

    await connectDB();

    const slug = await createUniqueSlug(name);

    const folder = await Folder.create({
      name,
      slug,
      cloudinaryFolderPath: `songify/${slug}`,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Folder created successfully",
        folder: serializeFolder(folder),
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("POST /api/folders error:", error);

    if (error?.code === 11000) {
      return NextResponse.json(
        {
          success: false,
          message: "Folder already exists",
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create folder",
      },
      { status: 500 }
    );
  }
}