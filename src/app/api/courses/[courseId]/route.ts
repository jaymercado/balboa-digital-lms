import { NextRequest, NextResponse } from 'next/server'

import connectMongo from '@/utils/mongodb'
import CategoryModel from '@/models/Course'

export async function GET(req: NextRequest, { params }: { params: { courseId: string } }) {
  try {
    await connectMongo()
    const course = await CategoryModel.findOne({ _id: params.courseId }).populate([
      'instructors',
      'enrollees',
      'modules',
    ])
    return NextResponse.json([course], { status: 200 })
  } catch (error) {
    console.error('Error in /api/courses/[courseId] (GET): ', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: { courseId: string } }) {
  try {
    const body = await req.json()
    await connectMongo()
    const res = await CategoryModel.findOneAndUpdate({ _id: params.courseId }, body, { new: true })
    return NextResponse.json(res, { status: 200 })
  } catch (error) {
    console.error('Error in /api/courses/[courseId] (PUT): ', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { courseId: string } }) {
  try {
    await connectMongo()
    const deleteCategory = await CategoryModel.findByIdAndDelete(params.courseId)
    return NextResponse.json(deleteCategory, { status: 200 })
  } catch (error) {
    console.error('Error in /api/courses/[courseId] (DELETE): ', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
