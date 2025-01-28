export const revalidate = 0

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'

import connectSupabase from '@/utils/databaseConnection'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession()
    const { searchParams } = new URL(req.url)
    const quizId = searchParams.get('quizId')

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

    let latestSubmission: any = {}
    const foundQuizResponses = await supabase
      .from('quizSubmissions')
      .select(
        `
        *,
        submissionAnswers(*, quizQuestions(question), questionOptions(option, isCorrect)))
      `,
      )
      .eq('studentId', user.data?.[0].id)
      .eq('quizId', quizId)
      .order('id', { ascending: false })
      .limit(1)
    latestSubmission = foundQuizResponses?.data?.[0] ?? null

    return NextResponse.json(latestSubmission, { status: 200 })
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

    const supabase = await connectSupabase()
    if (!supabase) {
      return NextResponse.json({ error: 'Failed to connect to Supabase' }, { status: 500 })
    }

    const user = await supabase.from('users').select('id').eq('email', session?.user.email)
    const userId = user.data?.[0].id
    if (!userId) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const quizSubmission = await supabase
      .from('quizSubmissions')
      .insert({
        quizId,
        studentId: userId,
      })
      .select()
    const quizSubmissionId = quizSubmission.data?.[0].id
    if (!quizSubmissionId) {
      return NextResponse.json({ error: 'Failed to create quiz response' }, { status: 500 })
    }

    const submissionAnswers = answers
      .map((answer: any) =>
        answer.answers.map((quizAnswer: any) => ({
          quizSubmissionId,
          quizQuestionId: answer.questionId,
          questionOptionId: quizAnswer,
        })),
      )
      .flat()

    await supabase.from('submissionAnswers').insert(submissionAnswers)

    return NextResponse.json({ quizSubmissionId }, { status: 200 })
  } catch (error) {
    console.error('Error in /api/courses (POST): ', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
