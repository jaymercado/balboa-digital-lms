export const revalidate = 0

import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'

import connectSupabase from '@/utils/databaseConnection'

export async function GET(req: NextRequest, { params }: { params: { courseId: string } }) {
  try {
    const session = await getServerSession()

    if (!session?.user.email) {
      throw new Error('Session not found')
    }

    const supabase = await connectSupabase()
    if (!supabase) {
      return NextResponse.json({ error: 'Failed to connect to Supabase' }, { status: 500 })
    }

    const courseQuizzesDB = await supabase
      .from('quizzes')
      .select()
      .eq('courseId', params.courseId)
      .order('id', { ascending: true })
    const courseQuizzes = courseQuizzesDB.data

    return NextResponse.json(courseQuizzes, { status: 200 })
  } catch (error) {
    console.error('Error in /api/courses (GET): ', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest, { params }: { params: { courseId: string } }) {
  try {
    const { courseId } = params
    const body = await req.json()
    const { title, description, questions } = body

    const supabase = await connectSupabase()
    if (!supabase) {
      return NextResponse.json({ error: 'Failed to connect to Supabase' }, { status: 500 })
    }

    // Save quiz
    const courseQuizDB = await supabase
      .from('quizzes')
      .insert({
        title,
        description,
        courseId,
      })
      .select()
    const courseQuiz = courseQuizDB.data?.[0]

    if (!courseQuiz) {
      return NextResponse.json({ error: 'Failed to create quiz' }, { status: 500 })
    }
    // Get latest course item
    const latestCourseItemDB = await supabase
      .from('courseItems')
      .select()
      .eq('courseId', courseId)
      .order('position', { ascending: false })
      .limit(1)
    const latestCourseItem = latestCourseItemDB.data?.[0]

    // Add course item
    const createdCourseItemRes = await supabase
      .from('courseItems')
      .insert({
        courseId,
        quizId: courseQuiz?.id,
        type: 'quiz',
        position: (latestCourseItem?.position || 0) + 1,
      })
      .select()
    const courseItem = createdCourseItemRes.data?.[0]
    const courseItemId = courseItem?.id ?? null

    if (!courseItemId) {
      return NextResponse.json({ error: 'Failed to create course item' }, { status: 500 })
    }

    for (const question of questions) {
      // Save question
      const quizQuestionDB = await supabase
        .from('quizQuestions')
        .insert({ quizId: courseQuiz.id, type: question.type, question: question.question })
        .select()
      const quizQuestion = quizQuestionDB.data?.[0]
      if (!quizQuestion) {
        return NextResponse.json({ error: 'Failed to create quiz question' }, { status: 500 })
      }
      // Save options
      const options = question.options.map((option: any) => ({
        quizQuestionId: quizQuestion.id,
        option: option.option,
        isCorrect: option.isCorrect,
      }))
      await supabase.from('questionOptions').insert(options).select()
    }

    return NextResponse.json(courseQuiz, { status: 200 })
  } catch (error) {
    console.error('Error in /api/courses/[courseId]/quizzes (POST): ', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
