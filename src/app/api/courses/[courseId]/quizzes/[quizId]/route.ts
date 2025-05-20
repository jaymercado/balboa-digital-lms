export const revalidate = 0

import { NextRequest, NextResponse } from 'next/server'

import connectSupabase from '@/utils/databaseConnection'
import { sendCourseNotificationEmail } from '@/lib/mailer'

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
      numQuestions: courseQuiz.numQuestions,
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

    // Notify users enrolled in the course
    const enrolledUsersRes = await supabase
      .from('enrollments')
      .select('user:users(email)')
      .eq('courseId', courseQuiz?.courseId)

    const courseDb = await supabase
      .from('courses')
      .select('title')
      .eq('id', courseQuiz?.courseId)
      .single()
    const courseName = courseDb.data?.title ?? 'Your Course'

    const quizLink = `${process.env.NEXT_PUBLIC_BASE_URL}/courses/${courseQuiz?.courseId}/quizzes/${courseQuiz?.id}`

    if (enrolledUsersRes.error) {
      console.error('Failed to fetch enrolled users:', enrolledUsersRes.error)
    } else {
      const enrolledUsers = enrolledUsersRes.data as unknown as { user: { email: string } }[]
      const notifyPromises = enrolledUsers.map(({ user }) =>
        sendCourseNotificationEmail({
          to: user.email,
          courseName,
          itemName: courseQuiz.title as string,
          itemLink: quizLink,
          notificationType: 'edited-quiz',
        }),
      )

      // Don't block response waiting for all emails to send
      Promise.allSettled(notifyPromises)
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
    const { title, description, questions, numQuestions } = body

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
        numQuestions,
      })
      .eq('id', quizId)

    if (quizError) {
      return NextResponse.json({ error: quizError.message }, { status: 500 })
    }

    // Fetch existing questions from the database
    const { data: existingQuestionsInDb, error: fetchQuestionsError } = await supabase
      .from('quizQuestions')
      .select('*')
      .eq('quizId', quizId)

    if (fetchQuestionsError) {
      return NextResponse.json({ error: fetchQuestionsError.message }, { status: 500 })
    }

    // Identify deleted questions
    const deletedQuestions = existingQuestionsInDb.filter(
      (dbQuestion) => !questions.some((question: any) => question.id === dbQuestion.id),
    )

    // Delete questions that are no longer in the updated list
    for (const deletedQuestion of deletedQuestions) {
      // Delete the question (cascade rule will handle associated options)
      const { error: deleteQuestionError } = await supabase
        .from('quizQuestions')
        .delete()
        .eq('id', deletedQuestion.id)

      if (deleteQuestionError) {
        return NextResponse.json({ error: deleteQuestionError.message }, { status: 500 })
      }
    }

    // Separate existing and new questions
    const existingQuestions = questions.filter((question: any) => question.id)
    const newQuestions = questions.filter((question: any) => !question.id)

    // Update existing questions
    for (const question of existingQuestions) {
      const { error: questionError } = await supabase
        .from('quizQuestions')
        .update({
          type: question.type,
          question: question.question,
        })
        .eq('id', question.id)

      if (questionError) {
        return NextResponse.json({ error: questionError.message }, { status: 500 })
      }

      // Update options for existing questions
      const optionsToUpsert = question.options.map((option: any) => ({
        id: option.id,
        quizQuestionId: question.id,
        option: option.option,
        isCorrect: option.isCorrect,
      }))

      const { error: optionsError } = await supabase
        .from('questionOptions')
        .upsert(optionsToUpsert, { onConflict: 'id' })

      if (optionsError) {
        return NextResponse.json({ error: optionsError.message }, { status: 500 })
      }
    }

    // Insert new questions
    for (const question of newQuestions) {
      // Insert new question
      const { data: newQuestion, error: questionError } = await supabase
        .from('quizQuestions')
        .insert({
          quizId,
          type: question.type,
          question: question.question,
        })
        .select()
        .single()

      if (questionError || !newQuestion) {
        return NextResponse.json(
          { error: questionError?.message || 'Failed to create question' },
          { status: 500 },
        )
      }

      // Insert options for the new question
      const optionsToInsert = question.options.map((option: any) => ({
        quizQuestionId: newQuestion.id,
        option: option.option,
        isCorrect: option.isCorrect,
      }))

      const { error: optionsError } = await supabase.from('questionOptions').insert(optionsToInsert)

      if (optionsError) {
        return NextResponse.json({ error: optionsError.message }, { status: 500 })
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

    const quizDb = await supabase.from('quizzes').delete().eq('id', params.quizId).select()
    const quiz = quizDb.data?.[0]

    return NextResponse.json(quiz, { status: 200 })
  } catch (error) {
    console.error('Error in /api/courses/[id] (DELETE): ', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
