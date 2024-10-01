import { NextRequest, NextResponse } from 'next/server'

import connectMongo from '@/utils/mongodb'
import ModuleModel from '@/models/Module'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectMongo()
    const courseModule = await ModuleModel.findOne({ _id: params.id })
    return NextResponse.json([courseModule], { status: 200 })
  } catch (error) {
    console.error('Error in /api/courses/[id] (GET): ', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json()
    await connectMongo()
    const res = await ModuleModel.findOneAndUpdate({ _id: params.id }, body, { new: true })
    return NextResponse.json(res, { status: 200 })
  } catch (error) {
    console.error('Error in /api/courses/[id] (PUT): ', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectMongo()
    const deleteCategory = await ModuleModel.findByIdAndDelete(params.id)
    return NextResponse.json(deleteCategory, { status: 200 })
  } catch (error) {
    console.error('Error in /api/courses/[id] (DELETE): ', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
