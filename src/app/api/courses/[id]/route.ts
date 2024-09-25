import { NextRequest, NextResponse } from 'next/server'

import connectMongo from '@/utils/mongodb'
import CategoryModel from '@/models/Course'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectMongo()
    const course = await CategoryModel.findOne({ _id: params.id })
      .populate('enrollees')
      .populate('instructors')
      console.log(course)
    return NextResponse.json([course], { status: 200 })
  } catch (error) {
    console.error('Error in /api/courses/[id] (GET): ', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json()
    await connectMongo()
    const res = await CategoryModel.findOneAndUpdate({ _id: params.id }, body, { new: true })
    return NextResponse.json(res, { status: 200 })
  } catch (error) {
    console.error('Error in /api/courses/[id] (PUT): ', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectMongo()
    const deleteCategory = await CategoryModel.findByIdAndDelete(params.id)
    return NextResponse.json(deleteCategory, { status: 200 })
  } catch (error) {
    console.error('Error in /api/courses/[id] (DELETE): ', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
