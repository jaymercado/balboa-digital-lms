import { NextResponse } from 'next/server'
import connectSupabase from '@/utils/databaseConnection'

export async function PUT(
  request: Request,
  { params }: { params: { userId: string; role: string } },
) {
  const { userId } = params

  const { role } = await request.json()
  console.log(`role: ${role}`)

  if (!['admin', 'instructor', 'student'].includes(role)) {
    return NextResponse.json({ message: 'Invalid role' }, { status: 400 })
  }

  try {
    const supabase = await connectSupabase()
    if (!supabase) {
      return NextResponse.json({ error: 'Failed to connect to Supabase' }, { status: 500 })
    }

    const updateUserRoleInDatabase = async (userId: string, role: string) => {
      const { data: updatedUser, error } = await supabase
        .from('users')
        .update({ role })
        .eq('id', userId)
        .single()

      if (error) {
        throw new Error(error.message)
      }

      return updatedUser
    }

    const updatedUser = await updateUserRoleInDatabase(userId, role)

    return NextResponse.json({ message: 'User role updated successfully', user: updatedUser })
  } catch (error) {
    console.error('Error updating user role:', error)

    return NextResponse.json({ message: 'Failed to update user role' }, { status: 500 })
  }
}
