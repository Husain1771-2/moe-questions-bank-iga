import { S3, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { APIGatewayProxyEvent } from "aws-lambda";

const s3 = new S3({
  region: process.env.AWS_REGION,
});

export async function getUploadLink(event: APIGatewayProxyEvent) {
  try {
    const queryParams = event.queryStringParameters || {};
    const fileType = queryParams.fileType; // MIME type
    const name = queryParams.name;
    const path = queryParams.path; // Relative path to the file
    const extension = queryParams.extension;
    if (!extension || !fileType || !name) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "File extension and fileType are required",
        }),
      };
    }

    // const Key = `${randomUUID()}.${extension}`;

    console.log(queryParams);

    const Key = `${path}/${name}`;

    const s3Params = {
      Bucket: process.env.BUCKET_NAME,
      Key,
      ContentType: fileType,
    };

    const uploadUrl = await getSignedUrl(s3, new PutObjectCommand(s3Params), {
      expiresIn: 60, // Set expiration time in seconds
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ uploadUrl, key: Key }),
    };
  } catch (error) {
    console.error("Error generating signed URL:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to generate signed URL" }),
    };
  }
}
