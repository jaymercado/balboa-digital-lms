import { NextResponse } from 'next/server'
import connectSupabase from '@/utils/databaseConnection'

export const revalidate = 0

// GET all groups
export async function GET() {
  try {
    const supabase = await connectSupabase()

    if (!supabase) {
      return NextResponse.json({ error: 'Failed to connect to Supabase' }, { status: 500 })
    }

    const { data, error } = await supabase.from('groups').select()

    if (error) {
      return NextResponse.json({ error: 'Failed to fetch groups', details: error }, { status: 500 })
    }

    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error('Error in /api/groups (GET): ', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

// POST a new group
export async function POST(req: Request) {
  try {
    const { name } = await req.json()

    if (!name) {
      return NextResponse.json({ error: 'Group name is required' }, { status: 400 })
    }

    const supabase = await connectSupabase()

    if (!supabase) {
      return NextResponse.json({ error: 'Failed to connect to Supabase' }, { status: 500 })
    }

    // Insert the new group into the database
    const { data, error } = await supabase.from('groups').insert([{ name }]).select()

    if (error) {
      return NextResponse.json({ error: 'Failed to create group', details: error }, { status: 500 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('Error in /api/groups (POST): ', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
