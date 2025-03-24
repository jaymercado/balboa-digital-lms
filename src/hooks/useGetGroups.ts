import React, { useState, useEffect } from 'react'

export function useGetGroups() {
  const [fetchingGroups, setFetchingGroups] = useState<boolean>(false)
  const [groups, setGroups] = useState<{ id: string; name: string }[]>([])

  useEffect(() => {
    const fetchGroups = async () => {
      setFetchingGroups(true)

      const res = await fetch('/api/groups')
      const fetchedGroups = (await res.json()) || []

      setGroups(fetchedGroups)
      setFetchingGroups(false)
    }

    fetchGroups()
  }, [])

  return {
    fetchingGroups,
    groups,
  }
}

export function useGetUserGroups() {
  const [fetchingUserGroups, setFetchingUserGroups] = useState<boolean>(false)
  const [userGroups, setUserGroups] = useState<{ user_id: string; group_id: string }[]>([])

  useEffect(() => {
    const fetchUserGroups = async () => {
      setFetchingUserGroups(true)

      try {
        const res = await fetch('/api/userGroups') // Fetch all user groups
        const fetchedUserGroups = (await res.json()) || []
        setUserGroups(fetchedUserGroups)
      } catch (error) {
        console.error('Error fetching user groups:', error)
      } finally {
        setFetchingUserGroups(false)
      }
    }

    fetchUserGroups()
  }, [])

  return {
    fetchingUserGroups,
    userGroups,
    setUserGroups, 
  }
}
