import { NextRequest, NextResponse } from 'next/server'

import connectMongo from '@/utils/mongodb'
import UserModel from '@/models/User'
import CourseModel from '@/models/Course'
import { getServerSession } from 'next-auth'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession()

    if (!session?.user.email) {
      return NextResponse.json({ error: 'Session not found' }, { status: 400 })
    }

    const { searchParams } = new URL(req.url)
    const type = searchParams.get('type')

    await connectMongo()
    const user = await UserModel.findOne({ email: session.user.email })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    let courses: string[] = []
    if (type === 'managed') {
      courses = await CourseModel.find({ instructors: user._id }).populate([
        'instructors',
        'enrollees',
        'modules',
      ])
    } else {
      courses = await CourseModel.find({ enrollees: user._id }).populate([
        'instructors',
        'enrollees',
        'modules',
      ])
    }

    return NextResponse.json(courses, { status: 200 })
  } catch (error) {
    console.error('Error in /api/courses (GET): ', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    await connectMongo()
    const course = await CourseModel.create(body)
    return NextResponse.json(course, { status: 200 })
  } catch (error) {
    console.error('Error in /api/courses (POST): ', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
