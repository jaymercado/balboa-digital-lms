export const revalidate = 0

import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'

import connectSupabase from '@/utils/databaseConnection'
import { calculateQuizScore } from '@/utils/calculateQuizScore'

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
      .select(
        `*, 
              courseItems(*, 
                modules(*), 
                quizzes(*, 
                  quizQuestions(*, 
                    questionOptions(*)
                  ),
                  quizSubmissions(*, 
                    submissionAnswers(*,
                      questionOptions(*)
                    )
                  )
                )
              )`,
      )
      .eq('courseId', params.courseId)
      .eq('studentId', user.data?.[0].id)
      .order('courseItemId', { ascending: true })
    const userCourseItemLogs = userCourseItemLogsDB.data as Record<string, any>[]

    const formattedUserCourseItemLogs = userCourseItemLogs?.map((log) => {
      let formattedLog = {
        ...log,
        completed: false,
        courseItem: {
          type: log.courseItems.type,
          id: log.courseItems.id,
          title: log.courseItems.title,
          score: 0,
        },
      }
      if (log.courseItems.type === 'module') {
        formattedLog.completed = true
      } else if (log.courseItems.type === 'quiz') {
        const quizSubmissions = log.courseItems.quizzes.quizSubmissions.filter(
          (submission: any) => submission.studentId === user.data?.[0].id,
        )
        if (quizSubmissions.length) {
          const latestSubmission = quizSubmissions[quizSubmissions.length - 1]
          const score = calculateQuizScore(
            log.courseItems.quizzes.quizQuestions.map((question: any) => ({
              ...question,
              options: question.questionOptions,
            })),
            latestSubmission?.submissionAnswers,
          )
          formattedLog.completed = score === '100'
          formattedLog.courseItem.score = +score
        }
      }

      return formattedLog
    })

    return NextResponse.json(formattedUserCourseItemLogs, { status: 200 })
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
