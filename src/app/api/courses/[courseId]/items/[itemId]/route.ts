import { NextRequest, NextResponse } from 'next/server'

import connectSupabase from '@/utils/databaseConnection'

export async function GET(req: NextRequest, { params }: { params: { itemId: string } }) {
  try {
    const supabase = await connectSupabase()
    if (!supabase) {
      return NextResponse.json({ error: 'Failed to connect to Supabase' }, { status: 500 })
    }
    const { itemId } = params

    const courseItemDb = await supabase
      .from('courseItems')
      .select('*, modules(title), quizzes(*)')
      .eq('id', itemId)
    const courseItem = courseItemDb.data?.[0]

    const { position } = courseItem

    const nextCourseItemDb = await supabase
      .from('courseItems')
      .select('id')
      .gt('position', position)
      .eq('courseId', courseItem?.courseId)
      .order('position', { ascending: true })
      .limit(1)
    const nextCourseItemId = nextCourseItemDb.data?.[0]?.id

    const previousCourseItemIdDb = await supabase
      .from('courseItems')
      .select('id')
      .lt('position', position)
      .eq('courseId', courseItem?.courseId)
      .order('position', { ascending: false })
      .limit(1)
    const previousCourseItemId = previousCourseItemIdDb.data?.[0]?.id

    return NextResponse.json(
      { courseItem, nextCourseItemId, previousCourseItemId },
      { status: 200 },
    )
  } catch (error) {
    console.error('Error in /api/courses/[id] (GET): ', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
