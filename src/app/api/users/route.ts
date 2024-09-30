import { NextRequest, NextResponse } from 'next/server'

import connectMongo from '@/utils/mongodb'
import UserModel from '@/models/User'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

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
