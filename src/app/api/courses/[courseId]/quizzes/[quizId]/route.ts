import { NextRequest, NextResponse } from 'next/server'

import connectSupabase from '@/utils/databaseConnection'
import { getAwsS3UploadUrl } from '@/utils/awsS3Connection'
import { isModuleContentMultimedia } from '@/utils/isModuleContentMultimedia'
import { awsBucketUrl } from '@/constants'

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
        question: question.question,
        type: question.type,
        answers: question.quizAnswers.map((answer: any) => ({
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

export async function PUT(req: NextRequest, { params }: { params: { quizId: string } }) {
  try {
    const { quizId } = params

    const formData = await req.formData()
    const title = formData.get('title')
    const description = formData.get('description')
    const type = formData.get('type') as string
    const courseId = formData.get('courseId')
    const fileExtension = formData.get('fileExtension') as string
    const fileName = `${courseId}-${quizId}.${fileExtension}`
    const isMultimedia = isModuleContentMultimedia(type)
    const content = isMultimedia ? `${awsBucketUrl}${fileName}` : formData.get('content')

    const supabase = await connectSupabase()
    if (!supabase) {
      return NextResponse.json({ error: 'Failed to connect to Supabase' }, { status: 500 })
    }

    await supabase
      .from('modules')
      .update({
        title,
        description,
        type,
        ...(content ? { content } : {}),
      })
      .eq('id', params.quizId)

    let awsS3UploadUrl = null
    if (isMultimedia && fileExtension) {
      awsS3UploadUrl = await getAwsS3UploadUrl(fileName, fileExtension)
    }

    return NextResponse.json({ awsS3UploadUrl }, { status: 200 })
  } catch (error) {
    console.error('Error in /api/courses/[id] (PUT): ', error)
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
