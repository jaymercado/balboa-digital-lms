import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

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
      console.error('Error in connectSupabase', error?.message)
    }
  }
}

async function uploadFileToS3(file: File, key: string) {
  try {
    const client = await connectAwsS3()
    if (!client) {
      throw new Error('Failed to connect to AWS S3')
    }
    const input = {
      Body: Buffer.from(await file.arrayBuffer()),
      Bucket: 'balboa-digital-lms',
      Key: key,
    }
    const command = new PutObjectCommand(input)
    await client.send(command)
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error in uploadFileToS3', error?.message)
    }
  }
}

export { uploadFileToS3 }
