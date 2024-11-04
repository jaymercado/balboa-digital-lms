import { NextRequest, NextResponse } from 'next/server'

import connectSupabase from '@/utils/databaseConnection'

export async function GET(req: NextRequest, { params }: { params: { courseId: string } }) {
  try {
    const supabase = await connectSupabase()
    if (!supabase) {
      return NextResponse.json({ error: 'Failed to connect to Supabase' }, { status: 500 })
    }

    const foundCourses = await supabase
      .from('courses')
      .select
      // '*, courseInstructors(users(id, name, role, email, createdAt)), enrollments(users(id, name, role, email, createdAt))',
      ()
      .eq('id', params.courseId)
    console.log(foundCourses)
    const courses = foundCourses.data

    return NextResponse.json(courses, { status: 200 })
  } catch (error) {
    console.error('Error in /api/courses/[courseId] (GET): ', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: { courseId: string } }) {
  try {
    const body = await req.json()

    const supabase = await connectSupabase()
    if (!supabase) {
      return NextResponse.json({ error: 'Failed to connect to Supabase' }, { status: 500 })
    }

    // TODO
    const res = await supabase.from('courses').update(body).eq('id', params.courseId)
    const course = res.data?.[0]

    return NextResponse.json(course, { status: 200 })
  } catch (error) {
    console.error('Error in /api/courses/[courseId] (PUT): ', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { courseId: string } }) {
  try {
    const supabase = await connectSupabase()
    if (!supabase) {
      return NextResponse.json({ error: 'Failed to connect to Supabase' }, { status: 500 })
    }

    // TODO
    const res = await supabase.from('courses').delete().eq('id', params.courseId)
    const course = res.data?.[0]

    return NextResponse.json(course, { status: 200 })
  } catch (error) {
    console.error('Error in /api/courses/[courseId] (DELETE): ', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
