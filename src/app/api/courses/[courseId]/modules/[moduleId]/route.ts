export const revalidate = 0

import { NextRequest, NextResponse } from 'next/server'

import connectSupabase from '@/utils/databaseConnection'
import { getAwsS3UploadUrl } from '@/utils/awsS3Connection'
import isModuleContentMultimedia from '@/utils/isModuleContentMultimedia'
import { awsBucketUrl } from '@/constants'

export async function GET(req: NextRequest, { params }: { params: { moduleId: string } }) {
  try {
    const supabase = await connectSupabase()
    if (!supabase) {
      return NextResponse.json({ error: 'Failed to connect to Supabase' }, { status: 500 })
    }
    const { moduleId } = params

    const courseModuleDb = await supabase.from('modules').select().eq('id', moduleId)
    const courseModule = courseModuleDb.data?.[0]
    const nextCourseModuleIdDb = await supabase
      .from('modules')
      .select('id')
      .gt('id', moduleId)
      .eq('courseId', courseModule?.courseId)
      .order('id', { ascending: true })
      .limit(1)
    const nextCourseModuleId = nextCourseModuleIdDb.data?.[0]?.id
    const previousCourseModuleIdDb = await supabase
      .from('modules')
      .select('id')
      .lt('id', moduleId)
      .eq('courseId', courseModule?.courseId)
      .order('id', { ascending: false })
      .limit(1)
    const previousCourseModuleId = previousCourseModuleIdDb.data?.[0]?.id

    return NextResponse.json(
      { courseModule, nextCourseModuleId, previousCourseModuleId },
      { status: 200 },
    )
  } catch (error) {
    console.error('Error in /api/courses/[id] (GET): ', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: { moduleId: string } }) {
  try {
    const { moduleId } = params

    const formData = await req.formData()
    const title = formData.get('title')
    const description = formData.get('description')
    const type = formData.get('type') as string
    const courseId = formData.get('courseId')
    const fileExtension = formData.get('fileExtension') as string
    const fileName = `${courseId}-${moduleId}.${fileExtension}`
    const isMultimedia = isModuleContentMultimedia(type)
    const content = isMultimedia ? `${awsBucketUrl}${fileName}` : formData.get('content')

    const supabase = await connectSupabase()
    if (!supabase) {
      return NextResponse.json({ error: 'Failed to connect to Supabase' }, { status: 500 })
    }

    await supabase
      .from('modules')
      .update({
        title,
        description,
        type,
        ...(content ? { content } : {}),
      })
      .eq('id', params.moduleId)

    let awsS3UploadUrl = null
    if (isMultimedia && fileExtension) {
      awsS3UploadUrl = await getAwsS3UploadUrl(fileName, fileExtension)
    }

    return NextResponse.json({ awsS3UploadUrl }, { status: 200 })
  } catch (error) {
    console.error('Error in /api/courses/[id] (PUT): ', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { moduleId: string } }) {
  try {
    const supabase = await connectSupabase()
    if (!supabase) {
      return NextResponse.json({ error: 'Failed to connect to Supabase' }, { status: 500 })
    }

    const courseModuleDb = await supabase
      .from('modules')
      .delete()
      .eq('id', params.moduleId)
      .select()
    const courseModule = courseModuleDb.data?.[0]

    return NextResponse.json(courseModule, { status: 200 })
  } catch (error) {
    console.error('Error in /api/courses/[id] (DELETE): ', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
