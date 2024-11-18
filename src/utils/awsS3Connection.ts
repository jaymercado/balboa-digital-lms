import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

let awsS3Client: S3Client | null = null

async function connectAwsS3() {
  try {
    if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
      throw new Error('AWS credentials not defined')
    }

    if (awsS3Client) {
      return awsS3Client
    } else {
      const awsS3Client = new S3Client({
        region: 'ap-southeast-1',
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
        },
      })
      return awsS3Client
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error in connectAwsS3', error?.message)
    }
  }
}

async function getAwsS3UploadUrl(fileName: string, fileType: string) {
  try {
    const client = await connectAwsS3()
    if (!client) {
      throw new Error('Failed to connect to AWS S3')
    }

    const params = {
      Bucket: 'balboa-digital-lms',
      Key: fileName,
      ContentType: fileType,
    }

    const command = new PutObjectCommand(params)
    const presigned = getSignedUrl(client, command, {
      expiresIn: 60,
    })

    return presigned
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error in uploadFileToS3', error?.message)
    }
  }
}

export { getAwsS3UploadUrl }
