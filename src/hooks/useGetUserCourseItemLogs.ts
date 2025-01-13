import React, { useState, useEffect } from 'react'
import { UserCourseItemLog } from '@/types/userCourseItemLog'

export function useGetUserCourseItemLogs({ courseId }: { courseId: string }) {
  const [fetchingUserCourseItemLogs, setFetchingUserCourseItemLogs] = useState<boolean>(false)
  const [userCourseItemLogs, setUserCourseItemLogs] = useState<UserCourseItemLog[]>([])

  useEffect(() => {
    const fetchUserCourseItemLogs = async () => {
      setFetchingUserCourseItemLogs(true)

      let url = `/api/courses/${courseId}/userCourseItemLogs`

      const res = await fetch(url)
      const fetchedUserCourseItemLogs = ((await res.json()) as UserCourseItemLog[]) || []

      setUserCourseItemLogs(fetchedUserCourseItemLogs)
    }

    fetchUserCourseItemLogs().finally(() => setFetchingUserCourseItemLogs(false))
  }, [courseId])

  return { fetchingUserCourseItemLogs, userCourseItemLogs, setFetchingUserCourseItemLogs }
}
