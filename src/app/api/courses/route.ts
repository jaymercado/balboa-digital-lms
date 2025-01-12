import { NextRequest, NextResponse } from 'next/server'
import type { PostgrestFilterBuilder } from '@supabase/postgrest-js'

import connectSupabase from '@/utils/databaseConnection'
import { getServerSession } from 'next-auth'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession()

    if (!session?.user.email) {
      return NextResponse.json({ error: 'Session not found' }, { status: 400 })
    }

    const { searchParams } = new URL(req.url)
    const type = searchParams.get('type')

    const supabase = await connectSupabase()
    if (!supabase) {
      return NextResponse.json({ error: 'Failed to connect to Supabase' }, { status: 500 })
    }

    const user = await supabase.from('users').select('*').eq('email', session.user.email)
    if (!user.data?.length) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    let courses: string[] = []
    if (type === 'managed') {
      // Get courses where the user is an instructor of
      const foundCourses = await supabase
        .from('courses')
        .select('*, courseInstructors!inner(instructorId)')
        .eq('courseInstructors.instructorId', user.data?.[0].id)
        .order('id', { ascending: true })
      courses = foundCourses.data ?? []
    } else if (type === 'enrolled') {
      const foundCourses = await supabase
        .from('courses')
        .select('*, enrollments!inner(studentId)')
        .eq('enrollments.studentId', user.data?.[0].id)
        .order('id', { ascending: true })
      courses = foundCourses.data ?? []
    } else {
      const allCourses = await supabase.from('courses').select('*').order('id', { ascending: true })
      courses = allCourses.data ?? []
    }

    return NextResponse.json(courses, { status: 200 })
  } catch (error) {
    console.error('Error in /api/courses (GET): ', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { title, description, enrollees, instructors } = body

    const supabase = await connectSupabase()
    if (!supabase) {
      return NextResponse.json({ error: 'Failed to connect to Supabase' }, { status: 500 })
    }

    // Add course
    const createdCourseRes = await supabase.from('courses').insert({ title, description }).select()
    const course = createdCourseRes.data?.[0]
    const courseId = course?.id ?? null
    if (!courseId) {
      return NextResponse.json({ error: 'Failed to create course' }, { status: 500 })
    }

    const requests: PostgrestFilterBuilder<any, any, null, 'courseInstructors', unknown>[] = []
    // Add enrollments
    requests.push(
      supabase
        .from('enrollments')
        .insert(enrollees.map((studentId: string) => ({ courseId, studentId }))),
    )

    // Add courseInstructors
    requests.push(
      supabase
        .from('courseInstructors')
        .insert(instructors.map((instructorId: string) => ({ courseId, instructorId }))),
    )

    await Promise.all(requests)

    return NextResponse.json(course, { status: 200 })
  } catch (error) {
    console.error('Error in /api/courses (POST): ', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
