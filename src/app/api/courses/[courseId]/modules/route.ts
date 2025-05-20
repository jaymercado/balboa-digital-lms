export const revalidate = 0

import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'

import connectSupabase from '@/utils/databaseConnection'
import { getAwsS3UploadUrl } from '@/utils/awsS3Connection'
import isModuleContentMultimedia from '@/utils/isModuleContentMultimedia'
import { awsBucketUrl } from '@/constants'
import { sendCourseNotificationEmail } from '@/lib/mailer'

export async function GET(req: NextRequest, { params }: { params: { courseId: string } }) {
  try {
    const session = await getServerSession()

    if (!session?.user.email) {
      return NextResponse.json({ error: 'Session not found' }, { status: 400 })
    }

    const supabase = await connectSupabase()
    if (!supabase) {
      return NextResponse.json({ error: 'Failed to connect to Supabase' }, { status: 500 })
    }

    const courseModulesDB = await supabase
      .from('modules')
      .select()
      .eq('courseId', params.courseId)
      .order('id', { ascending: true })
    const courseModules = courseModulesDB.data

    return NextResponse.json(courseModules, { status: 200 })
  } catch (error) {
    console.error('Error in /api/courses (GET): ', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const title = formData.get('title')
    const description = formData.get('description')
    const type = formData.get('type') as string
    const content = formData.get('content')
    const courseId = formData.get('courseId')
    const fileExtension = formData.get('fileExtension') as string
    const isMultimedia = isModuleContentMultimedia(type)

    const supabase = await connectSupabase()
    if (!supabase) {
      return NextResponse.json({ error: 'Failed to connect to Supabase' }, { status: 500 })
    }

    const courseModuleDB = await supabase
      .from('modules')
      .insert({
        title,
        description,
        type,
        content,
        courseId,
      })
      .select()
    const courseModule = courseModuleDB.data?.[0]

    if (!courseModule) {
      return NextResponse.json({ error: 'Failed to create course module' }, { status: 500 })
    }

    // Get latest course item
    const latestCourseItemDB = await supabase
      .from('courseItems')
      .select()
      .eq('courseId', courseId)
      .order('position', { ascending: false })
      .limit(1)
    const latestCourseItem = latestCourseItemDB.data?.[0]

    // Add course item
    const createdCourseItemRes = await supabase
      .from('courseItems')
      .insert({
        courseId,
        moduleId: courseModule?.id,
        type: 'module',
        position: (latestCourseItem?.position || 0) + 1,
      })
      .select()
    const courseItem = createdCourseItemRes.data?.[0]
    const courseItemId = courseItem?.id ?? null

    if (!courseItemId) {
      return NextResponse.json({ error: 'Failed to create course item' }, { status: 500 })
    }

    let awsS3UploadUrl = null
    if (isMultimedia && fileExtension) {
      const fileName = `${courseId}-${courseModule?.id}.${fileExtension}`
      if (isMultimedia && fileExtension) {
        awsS3UploadUrl = await getAwsS3UploadUrl(fileName, fileExtension)
      }

      const courseContent = `${awsBucketUrl}${fileName}`
      await supabase.from('modules').update({ content: courseContent }).eq('id', courseModule?.id)
    }

    // Notify users enrolled in the course
    const enrolledUsersRes = await supabase
      .from('enrollments')
      .select('user:users(email)')
      .eq('courseId', courseId)

    const courseDb = await supabase.from('courses').select('title').eq('id', courseId).single()
    const courseName = courseDb.data?.title ?? 'Your Course'

    const moduleLink = `${process.env.NEXT_PUBLIC_BASE_URL}/courses/${courseId}/modules/${courseModule?.id}`

    if (enrolledUsersRes.error) {
      console.error('Failed to fetch enrolled users:', enrolledUsersRes.error)
    } else {
      const enrolledUsers = enrolledUsersRes.data as unknown as { user: { email: string } }[]
      const notifyPromises = enrolledUsers.map(({ user }) =>
        sendCourseNotificationEmail({
          to: user.email,
          courseName,
          itemName: title as string,
          itemLink: moduleLink,
          notificationType: 'created-module',
        }),
      )

      // Don't block response waiting for all emails to send
      Promise.allSettled(notifyPromises)
    }

    return NextResponse.json({ awsS3UploadUrl }, { status: 200 })
  } catch (error) {
    console.error('Error in /api/courses (POST): ', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
