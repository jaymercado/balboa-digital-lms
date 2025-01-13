import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'

import connectSupabase from '@/utils/databaseConnection'

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

    const user = await supabase.from('users').select('*').eq('email', session.user.email)
    if (!user.data?.length) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const userCourseItemLogsDB = await supabase
      .from('userCourseItemLogs')
      .select('*')
      .eq('courseId', params.courseId)
      .eq('studentId', user.data?.[0].id)
      .order('courseItemId', { ascending: true })
    const userCourseItemLogs = userCourseItemLogsDB.data

    return NextResponse.json(userCourseItemLogs, { status: 200 })
  } catch (error) {
    console.error('Error in /api/courses (GET): ', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest, { params }: { params: { courseItemId: string } }) {
  try {
    const { courseItemId, courseId } = await req.json()

    const session = await getServerSession()
    if (!session?.user.email) {
      return NextResponse.json({ error: 'Session not found' }, { status: 400 })
    }

    const supabase = await connectSupabase()
    if (!supabase) {
      return NextResponse.json({ error: 'Failed to connect to Supabase' }, { status: 500 })
    }

    const user = await supabase.from('users').select('*').eq('email', session?.user.email)
    if (!user.data?.length) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Check if user has already logged this course item
    const userCourseItemLogDB = await supabase
      .from('userCourseItemLogs')
      .select('*')
      .eq('studentId', user.data?.[0].id)
      .eq('courseId', courseId)
      .eq('courseItemId', courseItemId)
    const userCourseItemLog = userCourseItemLogDB.data?.[0]

    if (userCourseItemLog) {
      return NextResponse.json(userCourseItemLog, { status: 200 })
    }

    const createdUserCourseItemLogDB = await supabase
      .from('userCourseItemLogs')
      .insert({
        studentId: user.data?.[0].id,
        courseItemId: courseItemId,
        courseId,
      })
      .select()
    const createdUserCourseItemLog = createdUserCourseItemLogDB.data?.[0]

    if (!createdUserCourseItemLog) {
      return NextResponse.json({ error: 'Failed to create user course item log' }, { status: 500 })
    }

    return NextResponse.json(createdUserCourseItemLog, { status: 200 })
  } catch (error) {
    console.error('Error in /api/courses/[courseId]/quizzes (POST): ', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
