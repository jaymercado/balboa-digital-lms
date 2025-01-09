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
          quizAnswers(*)
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
        answers: question.quizAnswers.map((answer: any) => ({
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

    for (const question of questions) {
      const { id: questionId, type, question: questionText, answers } = question

      const { data: updatedQuestion, error: questionError } = await supabase
        .from('quizQuestions')
        .upsert(
          {
            id: questionId,
            quizId,
            type,
            question: questionText,
          },
          { onConflict: 'id' },
        )
        .select()
        .single()

      if (questionError || !updatedQuestion) {
        return NextResponse.json(
          { error: questionError?.message || 'Failed to update question' },
          { status: 500 },
        )
      }

      for (const answer of answers) {
        const { id: answerId, answer: answerText, isCorrect } = answer

        const { error: answerError } = await supabase.from('quizAnswers').upsert(
          {
            id: answerId,
            quizQuestionId: updatedQuestion.id,
            answer: answerText,
            isCorrect,
          },
          { onConflict: 'id' },
        )

        if (answerError) {
          return NextResponse.json({ error: answerError.message }, { status: 500 })
        }
      }
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
