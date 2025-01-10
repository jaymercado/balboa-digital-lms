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
    const nextCourseIdDb = await supabase
      .from('quizzes')
      .select('id')
      .gt('id', quizId)
      .eq('courseQuiz', courseQuiz?.courseId)
      .order('id', { ascending: true })
      .limit(1)
    const nextCourseId = nextCourseIdDb.data?.[0]?.id
    const previousCourseIdDb = await supabase
      .from('modules')
      .select('id')
      .lt('id', quizId)
      .eq('courseQuiz', courseQuiz?.courseId)
      .order('id', { ascending: false })
      .limit(1)
    const previousCourseId = previousCourseIdDb.data?.[0]?.id

    const formattedCourseQuiz = {
      id: courseQuiz.id,
      title: courseQuiz.title,
      description: courseQuiz.description,
      questions: courseQuiz.quizQuestions.map((question: any) => ({
        id: question.id,
        question: question.question,
        type: question.type,
        answers: question.questionOptions.map((answer: any) => ({
          id: answer.id,
          answer: answer.answer,
          isCorrect: answer.isCorrect,
        })),
      })),
    }

    return NextResponse.json(
      { formattedCourseQuiz, nextCourseId, previousCourseId },
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

    const answersToUpsert = questions.flatMap((question: { answers: any[]; id: any }) =>
      question.answers.map((answer: { id: any; answer: any; isCorrect: any }) => ({
        id: answer.id,
        quizQuestionId: updatedQuestions.find((q) => q.id === question.id)?.id,
        answer: answer.answer,
        isCorrect: answer.isCorrect,
      })),
    )

    const { error: answersError } = await supabase
      .from('quizAnswers')
      .upsert(answersToUpsert, { onConflict: 'id' })

    if (answersError) {
      return NextResponse.json({ error: answersError.message }, { status: 500 })
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

    const courseQuizDb = await supabase.from('quizzes').delete().eq('id', params.quizId).select()
    const courseQuiz = courseQuizDb.data?.[0]

    return NextResponse.json(courseQuiz, { status: 200 })
  } catch (error) {
    console.error('Error in /api/courses/[id] (DELETE): ', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
