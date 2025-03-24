export const revalidate = 0

import { NextRequest, NextResponse } from 'next/server'
import connectSupabase from '@/utils/databaseConnection'
import { getServerSession } from 'next-auth'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession()

    if (!session?.user.email) {
      return NextResponse.json({ error: 'Session not found' }, { status: 400 })
    }

    const supabase = await connectSupabase()
    if (!supabase) {
      return NextResponse.json({ error: 'Failed to connect to Supabase' }, { status: 500 })
    }

    const { data: userGroups, error } = await supabase
      .from('user_groups')
      .select('user_id, group_id')

    if (error) {
      console.error('Error fetching user groups:', error)
      return NextResponse.json({ error: 'Failed to fetch user groups' }, { status: 500 })
    }

    return NextResponse.json(userGroups, { status: 200 })
  } catch (error) {
    console.error('Error in /api/user_groups (GET):', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { userId, groupId } = body

    const supabase = await connectSupabase()
    if (!supabase) {
      return NextResponse.json({ error: 'Failed to connect to Supabase' }, { status: 500 })
    }

    // Check if the user already belongs to the group
    const existingGroup = await supabase
      .from('user_groups')
      .select('*')
      .eq('user_id', userId)
      .eq('group_id', groupId)

    if (existingGroup.data?.length) {
      return NextResponse.json({ error: 'User is already in the group' }, { status: 400 })
    }

    // Insert the user into the group
    const { error } = await supabase
      .from('user_groups')
      .insert([{ user_id: userId, group_id: groupId }])

    if (error) {
      console.error('Error inserting user into group: ', error)
      return NextResponse.json({ error: 'Failed to assign user to group' }, { status: 500 })
    }

    return NextResponse.json({ message: 'User successfully added to the group' }, { status: 200 })
  } catch (error) {
    console.error('Error in /api/groups (POST): ', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: { userId: string } }) {
  const { userId } = params
  const { groupId } = await req.json()

  try {
    const supabase = await connectSupabase()

    if (!supabase) {
      return NextResponse.json({ error: 'Failed to connect to Supabase' }, { status: 500 })
    }

    // If groupId is null, remove the user from any group
    if (groupId === null) {
      // Remove user from all groups
      const { error: deleteError } = await supabase
        .from('user_groups')
        .delete()
        .eq('user_id', userId)

      if (deleteError) {
        console.error('Error removing user from group:', deleteError)
        return NextResponse.json({ error: 'Failed to remove user from group' }, { status: 500 })
      }

      return NextResponse.json({ message: 'User successfully removed from group' }, { status: 200 })
    } else {
      // Add user to the group if not already part of it
      const { error: existingGroupError } = await supabase
        .from('user_groups')
        .upsert({ user_id: userId, group_id: groupId })

      if (existingGroupError) {
        console.error('Error adding user to group:', existingGroupError)
        return NextResponse.json({ error: 'Failed to add user to group' }, { status: 500 })
      }

      return NextResponse.json({ message: 'User successfully added to group' }, { status: 200 })
    }
  } catch (error) {
    console.error('Error updating user group:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
