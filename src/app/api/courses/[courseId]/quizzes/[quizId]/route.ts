export const revalidate = 0

import { NextRequest, NextResponse } from 'next/server'

import connectSupabase from '@/utils/databaseConnection'

export async function GET(req: NextRequest, { params }: { params: { quizId: string } }) {
  try {
    const supabase = await connectSupabase()
    if (!supabase) {
      return NextResponse.json({ error: 'Failed to connect to Supabase' }, { status: 500 })
    }
    const { quizId } = params

    const courseQuizDb: any = await supabase
      .from('quizzes')
      .select(
        `
        *,
        quizQuestions (
          *,
          questionOptions(*)
        )
      `,
      )
      .eq('id', quizId)
    const courseQuiz = courseQuizDb.data?.[0]
    const nextQuizDb = await supabase
      .from('quizzes')
      .select('id')
      .gt('id', quizId)
      .eq('courseId', courseQuiz?.courseId)
      .order('id', { ascending: true })
      .limit(1)
    const nextQuizId = nextQuizDb.data?.[0]?.id
    const previousQuizDb = await supabase
      .from('quizzes')
      .select('id')
      .lt('id', quizId)
      .eq('courseId', courseQuiz?.courseId)
      .order('id', { ascending: false })
      .limit(1)
    const previousQuizId = previousQuizDb.data?.[0]?.id

    const formattedCourseQuiz = {
      id: courseQuiz.id,
      title: courseQuiz.title,
      description: courseQuiz.description,
      questions: courseQuiz.quizQuestions.map((question: any) => ({
        id: question.id,
        question: question.question,
        type: question.type,
        options: question.questionOptions.map((option: any) => ({
          id: option.id,
          option: option.option,
          isCorrect: option.isCorrect,
        })),
      })),
    }

    return NextResponse.json(
      { courseQuiz: formattedCourseQuiz, previousQuizId, nextQuizId },
      { status: 200 },
    )
  } catch (error) {
    console.error('Error in /api/courses/[id] (GET): ', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { courseId: string; quizId: string } },
) {
  try {
    const { courseId, quizId } = params
    const body = await req.json()
    const { title, description, questions } = body

    const supabase = await connectSupabase()
    if (!supabase) {
      return NextResponse.json({ error: 'Failed to connect to Supabase' }, { status: 500 })
    }

    // Update the quiz
    const { error: quizError } = await supabase
      .from('quizzes')
      .update({
        title,
        description,
        courseId,
      })
      .eq('id', quizId)

    if (quizError) {
      return NextResponse.json({ error: quizError.message }, { status: 500 })
    }

    // Update the questions
    const questionsToUpsert = questions.map((question: { id: any; type: any; question: any }) => ({
      id: question.id,
      quizId,
      type: question.type,
      question: question.question,
    }))

    const { data: updatedQuestions, error: questionsError } = await supabase
      .from('quizQuestions')
      .upsert(questionsToUpsert, { onConflict: 'id' })
      .select()

    if (questionsError) {
      return NextResponse.json({ error: questionsError.message }, { status: 500 })
    }

    // Update the options
    const optionsToUpsert = questions.flatMap((question: { options: any[]; id: any }) =>
      question.options.map((option: { id: any; option: any; isCorrect: any }) => ({
        id: option.id,
        quizQuestionId: updatedQuestions.find((q) => q.id === question.id)?.id,
        option: option.option,
        isCorrect: option.isCorrect,
      })),
    )

    const { error: optionsError } = await supabase
      .from('questionOptions')
      .upsert(optionsToUpsert, { onConflict: 'id' })

    if (optionsError) {
      return NextResponse.json({ error: optionsError.message }, { status: 500 })
    }

    return NextResponse.json({ message: 'Quiz updated successfully' }, { status: 200 })
  } catch (error) {
    console.error('Error in /api/courses/[courseId]/quizzes/[quizId] (PUT):', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { quizId: string } }) {
  try {
    const supabase = await connectSupabase()
    if (!supabase) {
      return NextResponse.json({ error: 'Failed to connect to Supabase' }, { status: 500 })
    }

    const quizDb = await supabase.from('quizzes').delete().eq('id', params.quizId).select()
    const quiz = quizDb.data?.[0]

    return NextResponse.json(quiz, { status: 200 })
  } catch (error) {
    console.error('Error in /api/courses/[id] (DELETE): ', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
