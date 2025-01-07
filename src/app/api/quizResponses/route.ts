import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'

import connectSupabase from '@/utils/databaseConnection'

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
    } else {
      const foundCourses = await supabase
        .from('courses')
        .select('*, enrollments!inner(studentId)')
        .eq('enrollments.studentId', user.data?.[0].id)
        .order('id', { ascending: true })
      courses = foundCourses.data ?? []
    }

    return NextResponse.json(courses, { status: 200 })
  } catch (error) {
    console.error('Error in /api/courses (GET): ', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession()

    const body = await req.json()
    const { quizId, answers } = body
    console.log(answers)

    const supabase = await connectSupabase()
    if (!supabase) {
      return NextResponse.json({ error: 'Failed to connect to Supabase' }, { status: 500 })
    }

    const user = await supabase.from('users').select('id').eq('email', session?.user.email)
    const userId = user.data?.[0].id
    if (!userId) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const quizResponse = await supabase
      .from('quizResponses')
      .insert({
        quizId,
        studentId: userId,
      })
      .select()
    const quizResponseId = quizResponse.data?.[0].id
    if (!quizResponseId) {
      return NextResponse.json({ error: 'Failed to create quiz response' }, { status: 500 })
    }

    const responses = answers
      .map((answer: any) =>
        answer.answers.map((quizAnswer: any) => ({
          quizResponseId,
          quizQuestionId: answer.questionId,
          quizAnswerId: quizAnswer,
        })),
      )
      .flat()

    await supabase.from('responses').insert(responses)

    return NextResponse.json({ quizResponseId }, { status: 200 })
  } catch (error) {
    console.error('Error in /api/courses (POST): ', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
