import React, { useState, useEffect } from 'react'
import { User } from '@/types/user'
import { Course } from '@/types/course'

export default function useGetUser(userId: string) {
  const [user, setUser] = useState<User | null>(null)
  const [fetchingUser, setFetchingUser] = useState<boolean>(false)
  const [userNotFound, setUserNotFound] = useState<boolean>(false)
  const [courses, setCourses] = useState<Course[]>([])

  useEffect(() => {
    const fetchUser = async () => {
      setFetchingUser(true)
      try {
        const res = await fetch(`/api/users/${userId}`)
        if (!res.ok) {
          if (res.status === 404) {
            setUserNotFound(true)
            return
          }
          throw new Error('Failed to fetch user')
        }
        const data = await res.json()
        setUser(data.user)
        setCourses(data.enrolledCourses)
      } catch (error) {
        console.error(error)
      } finally {
        setFetchingUser(false)
      }
    }

    if (userId) {
      fetchUser()
    }
  }, [userId])

  return { user, setUser, courses, setCourses, fetchingUser, userNotFound }
}
