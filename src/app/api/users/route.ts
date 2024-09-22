import { NextRequest, NextResponse } from 'next/server'

import connectMongo from '@/utils/mongodb'
import UserModel from '@/models/User'
import { getServerSession } from 'next-auth'

export async function GET() {
  try {
    const session = await getServerSession()

    if (!session?.user.email) {
      return NextResponse.json({ error: 'Session not found' }, { status: 400 })
    }

    await connectMongo()
    const users = await UserModel.find()
    return NextResponse.json(users, { status: 200 })
  } catch (error) {
    console.error('Error in /api/users (GET): ', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
