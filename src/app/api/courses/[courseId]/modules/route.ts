import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'

import connectSupabase from '@/utils/databaseConnection'
import { uploadFileToS3 } from '@/utils/awsS3Connection'
import { isModuleContentMultimedia } from '@/utils/isModuleContentMultimedia'
import { awsBucketUrl } from '@/constants'

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

    const courseModulesDB = await supabase.from('modules').select().eq('courseId', params.courseId)
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
    const file = formData.get('file') as File
    const fileExtension = formData.get('fileExtension')
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

    if (isMultimedia && file) {
      const fileName = `${courseId}-${courseModule?.id}.${fileExtension}`
      await uploadFileToS3(file, fileName)

      const courseContent = `${awsBucketUrl}${fileName}`
      await supabase.from('modules').update({ content: courseContent }).eq('id', courseModule?.id)
    }

    return NextResponse.json(courseModule, { status: 200 })
  } catch (error) {
    console.error('Error in /api/courses (POST): ', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
