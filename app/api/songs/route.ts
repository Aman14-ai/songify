import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/auth";
import { connectDB } from "@/lib/db";
import Song from "@/models/Song";
import Folder from "@/models/Folder";

export const runtime = "nodejs";

function serializeSong(song: any) {
  return {
    _id: song._id.toString(),
    title: song.title,
    folderId: song.folderId.toString(),
    audioUrl: song.audioUrl,
    cloudinaryPublicId: song.cloudinaryPublicId,
    duration: song.duration || 0,
    playCount: song.playCount || 0,
    createdAt: song.createdAt,
    updatedAt: song.updatedAt,
  };
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const folderId = searchParams.get("folderId");

    const query = folderId ? { folderId } : {};

    const songs = await Song.find(query).sort({ createdAt: -1 }).lean();

    return NextResponse.json({
      success: true,
      songs: songs.map((song: any) => ({
        _id: song._id.toString(),
        title: song.title,
        folderId: song.folderId.toString(),
        audioUrl: song.audioUrl,
        cloudinaryPublicId: song.cloudinaryPublicId,
        duration: song.duration || 0,
        playCount: song.playCount || 0,
        createdAt: song.createdAt,
        updatedAt: song.updatedAt,
      })),
    });
  } catch (error) {
    console.error("GET /api/songs error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch songs",
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

    if (session.user.role !== "admin") {
      return NextResponse.json(
        {
          success: false,
          message: "Only admin can upload songs",
        },
        { status: 403 }
      );
    }

    const body = await request.json();

    const title = String(body.title || "").trim();
    const folderId = String(body.folderId || "").trim();
    const audioUrl = String(body.audioUrl || "").trim();
    const cloudinaryPublicId = String(body.cloudinaryPublicId || "").trim();
    const duration = Number(body.duration || 0);

    if (!title) {
      return NextResponse.json(
        {
          success: false,
          message: "Song title is required",
        },
        { status: 400 }
      );
    }

    if (!folderId) {
      return NextResponse.json(
        {
          success: false,
          message: "Folder is required",
        },
        { status: 400 }
      );
    }

    if (!audioUrl || !cloudinaryPublicId) {
      return NextResponse.json(
        {
          success: false,
          message: "Cloudinary upload data is missing",
        },
        { status: 400 }
      );
    }

    await connectDB();

    const folderExists = await Folder.exists({ _id: folderId });

    if (!folderExists) {
      return NextResponse.json(
        {
          success: false,
          message: "Selected folder does not exist",
        },
        { status: 404 }
      );
    }

    const song = await Song.create({
      title,
      folderId,
      audioUrl,
      cloudinaryPublicId,
      duration,
      playCount: 0,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Song saved successfully",
        song: serializeSong(song),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/songs error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to save song",
      },
      { status: 500 }
    );
  }
}