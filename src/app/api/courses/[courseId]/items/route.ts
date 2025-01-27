export const revalidate = 0

import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'

import connectSupabase from '@/utils/databaseConnection'

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

    const courseItemsDB = await supabase
      .from('courseItems')
      .select('*, modules(title), quizzes(title)')
      .eq('courseId', params.courseId)
      .order('position', { ascending: true })
    const courseItems = courseItemsDB.data
    const formattedCourseItems =
      courseItems?.map((item) => {
        return {
          ...item,
          title: item?.modules?.title || item?.quizzes?.title,
        }
      }) || []

    return NextResponse.json(formattedCourseItems, { status: 200 })
  } catch (error) {
    console.error('Error in /api/courses (GET): ', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
