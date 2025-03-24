export const revalidate = 0

import { NextRequest, NextResponse } from 'next/server'
import connectSupabase from '@/utils/databaseConnection'

export async function PUT(req: NextRequest, { params }: { params: { userId: string } }) {
  const { userId } = params
  const { groupIds } = await req.json() // Expecting an array of group IDs

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
  }

  try {
    const supabase = await connectSupabase()
    if (!supabase) {
      return NextResponse.json({ error: 'Failed to connect to Supabase' }, { status: 500 })
    }

    // Remove all existing group entries for this user
    const { error: deleteError } = await supabase.from('user_groups').delete().eq('user_id', userId)

    if (deleteError) {
      console.error('Error removing old groups:', deleteError)
      return NextResponse.json({ error: 'Failed to remove old groups' }, { status: 500 })
    }

    // Insert new group associations
    if (groupIds.length > 0) {
      const { error: insertError } = await supabase.from('user_groups').insert(
        groupIds.map((groupId: string) => ({
          user_id: userId,
          group_id: groupId,
        })),
      )

      if (insertError) {
        console.error('Error assigning new groups:', insertError)
        return NextResponse.json({ error: 'Failed to assign new groups' }, { status: 500 })
      }
    }

    return NextResponse.json({ message: 'User groups updated successfully' }, { status: 200 })
  } catch (error) {
    console.error('Error in PUT /api/userGroups:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
