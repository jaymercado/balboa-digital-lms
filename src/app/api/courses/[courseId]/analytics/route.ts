export const revalidate = 0

import { NextRequest, NextResponse } from 'next/server'
import connectSupabase from '@/utils/databaseConnection'
import { calculateQuizScore } from '@/utils/calculateQuizScore'

export async function GET(req: NextRequest, { params }: { params: { courseId: string } }) {
  try {
    const supabase = await connectSupabase()
    if (!supabase) throw new Error('Failed to connect to Supabase')

    const foundCourses = await supabase
      .from('courses')
      .select(
        `
        *,
        enrollments(
          users (id, name, 
            userCourseItemLogs(*, 
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
              )
            )
          )
        )
      `,
      )
      .eq('id', params.courseId)

    const foundCourse = foundCourses.data?.[0]
    if (!foundCourse) throw new Error('Course not found')

    const courseAnalytics = {
      id: foundCourse.id,
      title: foundCourse.title,
      students: foundCourse.enrollments.map((enrollment: any) => {
        const student = enrollment.users
        const userCourseItemLogs = student.userCourseItemLogs.filter(
          (log: any) => log.studentId === student.id,
        )
        const formattedUserCourseItemLogs = userCourseItemLogs?.map((log: any) => {
          let formattedLog = {
            completed: false,
            courseItem: {
              type: log.courseItems.type,
              id: log.courseItems.id,
              title: log.courseItems.modules?.title || log.courseItems.quizzes?.title,
              score: 0,
            },
          }

          if (log.courseItems.type === 'module') {
            formattedLog.completed = true
          } else if (log.courseItems.type === 'quiz') {
            const quizSubmissions = log.courseItems.quizzes.quizSubmissions
              .filter((submission: any) => +submission.studentId === +student.id)
              .sort((a: any, b: any) => a.id - b.id)

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

        return {
          id: student.id,
          name: student.name,
          courseItemLogs: formattedUserCourseItemLogs,
        }
      }),
    }

    return NextResponse.json(courseAnalytics, { status: 200 })
  } catch (error) {
    console.error('Error in /api/courses/[courseId] (GET): ', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
