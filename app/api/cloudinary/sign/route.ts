import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/auth";
import { cloudinary } from "@/lib/cloudinary";

export const runtime = "nodejs";

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

    const folder = String(body.folder || "").trim();

    if (!folder) {
      return NextResponse.json(
        {
          success: false,
          message: "Cloudinary folder path is required",
        },
        { status: 400 }
      );
    }

    if (!folder.startsWith("songify/")) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid folder path",
        },
        { status: 400 }
      );
    }

    const timestamp = Math.round(Date.now() / 1000);

    const paramsToSign = {
      timestamp,
      folder,
    };

    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      process.env.CLOUDINARY_API_SECRET!
    );

    return NextResponse.json({
      success: true,
      signature,
      timestamp,
      folder,
      apiKey: process.env.CLOUDINARY_API_KEY,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    });
  } catch (error) {
    console.error("POST /api/cloudinary/sign error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create Cloudinary signature",
      },
      { status: 500 }
    );
  }
}