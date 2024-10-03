import { NextRequest, NextResponse } from 'next/server'

import { Module } from '@/types/module'
import { Course } from '@/types/course'
import connectMongo from '@/utils/mongodb'
import UserModel from '@/models/User'
import ModuleModel from '@/models/Module'
import CourseModel from '@/models/Course'
import { getServerSession } from 'next-auth'

export async function GET(req: NextRequest, { params }: { params: { courseId: string } }) {
  try {
    const session = await getServerSession()

    if (!session?.user.email) {
      return NextResponse.json({ error: 'Session not found' }, { status: 400 })
    }

    await connectMongo()
    const user = await UserModel.findOne({ email: session.user.email })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const courses: Course[] = await CourseModel.findById(params.courseId).populate('modules')
    const modules: Module[] = courses[0]?.modules || []

    return NextResponse.json(modules, { status: 200 })
  } catch (error) {
    console.error('Error in /api/courses (GET): ', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    await connectMongo()
    const courseModule = await ModuleModel.create(body)
    console.log(1234567890, courseModule, body)
    await CourseModel.findByIdAndUpdate(body.courseId, {
      $push: { modules: courseModule._id },
    })
    return NextResponse.json(courseModule, { status: 200 })
  } catch (error) {
    console.error('Error in /api/courses (POST): ', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
