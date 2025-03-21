import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const R2 = new S3Client({
    region: "auto",
    endpoint: process.env.CLOUDFLARE_ENDPOINT,
    credentials: {
        accessKeyId: process.env.CLOUDFLARE_ACCESS_KEY_ID!,
        secretAccessKey: process.env.CLOUDFLARE_SECRET_ACCESS_KEY!,
    },
});

export async function getUploadUrl() {
    const key = `${Date.now()}-${Math.random().toString(36).substring(2)}`;
    const command = new PutObjectCommand({
        Bucket: process.env.CLOUDFLARE_BUCKET_NAME,
        Key: key,
    });
    const signedUrl = await getSignedUrl(R2, command, { expiresIn: 3600 });
    return { signedUrl, key };
}

export async function getImageUrl(key: string) {
    return `${process.env.CLOUDFLARE_PUBLIC_URL}/${key}`;
} 