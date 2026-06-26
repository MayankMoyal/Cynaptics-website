import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client } from "@/lib/s3Client";

export async function POST(request: Request) {
  try {
    // 1. Authorize user
    const session = await getServerSession(authOptions);
    if (!session || (!session.user.isAdmin && !session.user.isEditor)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Parse request body
    const body = await request.json();
    const { fileName, fileType, folder = "posts", slug } = body;

    if (!fileName || !fileType) {
      return NextResponse.json(
        { error: "Missing fileName or fileType" },
        { status: 400 }
      );
    }

    // 3. Generate unique object key
    const cleanFileName = fileName.replace(/[^a-zA-Z0-9.\-_]/g, "");
    let objectKey = "";
    
    if (slug) {
      // Use exact slug for posts to overwrite old files and save space
      if (folder === "posts") {
        objectKey = `${folder}/${slug}.mdx`;
      } else {
        // For images, we drop the filename entirely to ensure overwrites across formats
        objectKey = `${folder}/${slug}`;
      }
    } else {
      // Fallback to timestamp if no slug provided
      const timestamp = Date.now();
      objectKey = `${folder}/${timestamp}-${cleanFileName}`;
    }
    const bucketName = process.env.S3_BUCKET_NAME;

    if (!bucketName) {
      return NextResponse.json(
        { error: "S3_BUCKET_NAME is not configured" },
        { status: 500 }
      );
    }

    // 4. Create PutObject command
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: objectKey,
      ContentType: fileType,
    });

    // 5. Generate presigned URL (valid for 5 minutes)
    const presignedUrl = await getSignedUrl(s3Client, command, { expiresIn: 300 });

    // 6. Return presigned URL and the final public URL
    // Use NEXT_PUBLIC_S3_BASE_URL if available (for CloudFront or custom domain), fallback to standard S3 URL
    const baseUrl =
      process.env.NEXT_PUBLIC_S3_BASE_URL ||
      `https://${bucketName}.s3.${process.env.AWS_REGION || "ap-south-1"}.amazonaws.com`;
    
    const publicUrl = `${baseUrl}/${objectKey}`;

    return NextResponse.json({ presignedUrl, publicUrl, objectKey });
  } catch (error) {
    console.error("[api/upload/presign] Error:", error);
    return NextResponse.json(
      { error: "Failed to generate presigned URL" },
      { status: 500 }
    );
  }
}
