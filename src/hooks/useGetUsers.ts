import React, { useState, useEffect } from 'react'
import { User } from '@/types/user'

export default function useGetUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [fetchingUsers, setFetchingUsers] = useState<boolean>(false)

  useEffect(() => {
    const fetchUsers = async () => {
      setFetchingUsers(true)
      const res = await fetch('/api/users')
      const fetchedUsers = ((await res.json()) as User[]) || []
      setUsers(fetchedUsers)
    }

    fetchUsers().finally(() => setFetchingUsers(false))
  }, [])

  return { users, setUsers, fetchingUsers }
}
