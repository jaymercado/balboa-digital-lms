import { NextRequest, NextResponse } from 'next/server'

import connectSupabase from '@/utils/databaseConnection'

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
    const body = await req.json()
    const { title, description, type, content } = body

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
