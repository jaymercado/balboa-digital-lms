export const revalidate = 0

import { NextResponse } from 'next/server'
import connectSupabase from '@/utils/databaseConnection'

export async function GET(request: Request, { params }: { params: { userId: string } }) {
  const { userId } = params

  try {
    const supabase = await connectSupabase()
    if (!supabase) {
      return NextResponse.json({ error: 'Failed to connect to Supabase' }, { status: 500 })
    }

    // Fetch user by ID
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()

    if (userError || !user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    // Fetch enrolled courses for that user
    const { data: enrolledCourses, error: coursesError } = await supabase
      .from('courses')
      .select('*, enrollments!inner(studentId)')
      .eq('enrollments.studentId', userId)
      .order('id', { ascending: true })

    if (coursesError) {
      return NextResponse.json({ message: 'Failed to fetch enrolled courses' }, { status: 500 })
    }

    // Combine both in one response
    return NextResponse.json({
      user,
      enrolledCourses,
    })
  } catch (error) {
    console.error('Error fetching user and courses:', error)
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { userId: string; role: string } },
) {
  const { userId } = params
  const { role } = await request.json()

  if (!['admin', 'instructor', 'student'].includes(role)) {
    return NextResponse.json({ message: 'Invalid role' }, { status: 400 })
  }

  try {
    const supabase = await connectSupabase()
    if (!supabase) {
      return NextResponse.json({ error: 'Failed to connect to Supabase' }, { status: 500 })
    }

    const { error: userError } = await supabase
      .from('users')
      .update({ role })
      .eq('id', userId)
      .single()

    if (userError) {
      return NextResponse.json({ message: 'Failed to update user role' }, { status: 500 })
    }

    return NextResponse.json({ message: 'User role updated successfully' }, { status: 200 })
  } catch (error) {
    console.error('Error updating user role:', error)

    return NextResponse.json({ message: 'Failed to update user role' }, { status: 500 })
  }
}
