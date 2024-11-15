import { NextRequest, NextResponse } from 'next/server'

import connectSupabase from '@/utils/databaseConnection'
import { uploadFileToS3 } from '@/utils/awsS3Connection'
import { isModuleContentMultimedia } from '@/utils/isModuleContentMultimedia'
import { awsBucketUrl } from '@/constants'

export async function GET(req: NextRequest, { params }: { params: { moduleId: string } }) {
  try {
    const supabase = await connectSupabase()
    if (!supabase) {
      return NextResponse.json({ error: 'Failed to connect to Supabase' }, { status: 500 })
    }

    const courseModuleDb = await supabase.from('modules').select().eq('id', params.moduleId)
    const courseModules = courseModuleDb.data

    return NextResponse.json(courseModules, { status: 200 })
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
    const file = formData.get('file') as File
    const fileExtension = formData.get('fileExtension')
    const fileName = `${courseId}-${moduleId}.${fileExtension}`
    const isMultimedia = isModuleContentMultimedia(type)
    const content = isMultimedia ? `${awsBucketUrl}${fileName}` : formData.get('content')

    const supabase = await connectSupabase()
    if (!supabase) {
      return NextResponse.json({ error: 'Failed to connect to Supabase' }, { status: 500 })
    }

    const courseModuleDb = await supabase
      .from('modules')
      .update({ title, description, type, content })
      .eq('id', params.moduleId)
      .select()
    const courseModule = courseModuleDb.data?.[0]

    if (isMultimedia && file) {
      await uploadFileToS3(file, fileName)
    }

    return NextResponse.json(courseModule, { status: 200 })
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
