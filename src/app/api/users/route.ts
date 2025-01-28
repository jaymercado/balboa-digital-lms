export const revalidate = 0

import { NextResponse } from 'next/server'

import connectSupabase from '@/utils/databaseConnection'
import { getServerSession } from 'next-auth'
import authOptions from '@/utils/authOptions'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user.email) {
      return NextResponse.json({ error: 'Session not found' }, { status: 400 })
    }

    const supabase = await connectSupabase()
    if (!supabase) {
      return NextResponse.json({ error: 'Failed to connect to Supabase' }, { status: 500 })
    }

    const usersDb = await supabase.from('users').select()
    const users = usersDb.data

    return NextResponse.json(users, { status: 200 })
  } catch (error) {
    console.error('Error in /api/users (GET): ', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
