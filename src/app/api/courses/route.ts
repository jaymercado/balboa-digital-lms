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

    if (type === 'managed') {
      await connectMongo()
      const user = await UserModel.findOne({ email: session.user.email })
      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
      }
      const courses = await CourseModel.find({ managers: user._id })
      return NextResponse.json({ status: 'Success', data: courses })
    }

    const courses: string[] = []

    return NextResponse.json({ status: 'Success', data: courses })
  } catch (error) {
    console.error('Error in /api/courses (GET): ', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

// export async function POST(req: NextRequest) {
//   try {
//     const body = await req.json()
//     await connectMongo()
//     await CategoryModel.create(body)
//     const course = await CategoryModel.find()
//     return NextResponse.json({ status: 'Success', data: course })
//   } catch (error) {
//     console.error('Error in /api/courses (POST): ', error)
//     return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
//   }
// }
