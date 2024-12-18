import { NextRequest, NextResponse } from 'next/server'
import type { PostgrestFilterBuilder } from '@supabase/postgrest-js'

import connectSupabase from '@/utils/databaseConnection'

export async function GET(req: NextRequest, { params }: { params: { courseId: string } }) {
  try {
    const supabase = await connectSupabase()
    if (!supabase) throw new Error('Failed to connect to Supabase')

    const foundCourses = await supabase
      .from('courses')
      .select(
        `
        *,
        courseInstructors(users (id, name)),
        enrollments(users (id, name)),
        modules(*)
      `,
      )
      .eq('id', params.courseId)

    const foundCourse = foundCourses.data?.[0]
    if (!foundCourse) throw new Error('Course not found')

    const formattedCourse = {
      ...foundCourse,
      instructors: foundCourse.courseInstructors.map((instructor: any) => ({
        id: instructor.users.id,
        name: instructor.users.name,
      })),
      enrollees: foundCourse.enrollments.map((enrollment: any) => ({
        id: enrollment.users.id,
        name: enrollment.users.name,
      })),
    }

    return NextResponse.json(formattedCourse, { status: 200 })
  } catch (error) {
    console.error('Error in /api/courses/[courseId] (GET): ', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: { courseId: string } }) {
  try {
    const body = await req.json()
    const { title, description, enrollees, instructors } = body
    const { courseId } = params

    const supabase = await connectSupabase()
    if (!supabase) {
      return NextResponse.json({ error: 'Failed to connect to Supabase' }, { status: 500 })
    }

    const res = await supabase
      .from('courses')
      .update({
        title,
        description,
      })
      .eq('id', courseId)
      .select()

    // Delete courseInstructors and enrollments
    await Promise.all([
      supabase.from('courseInstructors').delete().eq('courseId', courseId),
      supabase.from('enrollments').delete().eq('courseId', courseId),
    ])

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

    const res = await supabase.from('courses').delete().eq('id', params.courseId).select()
    const course = res.data?.[0]

    return NextResponse.json(course, { status: 200 })
  } catch (error) {
    console.error('Error in /api/courses/[courseId] (DELETE): ', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
