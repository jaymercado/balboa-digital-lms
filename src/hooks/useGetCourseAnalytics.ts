import React, { useState, useEffect } from 'react'

export function useGetCourseAnalytics({
  type,
  courseId,
}: {
  type?: 'managed' | 'enrolled'
  courseId?: string
}) {
  const [courseAnalytics, setCourseAnalytics] = useState<CourseAnalyticsType | null>(null)
  const [fetchingCourseAnalytics, setFetchingCourseAnalytics] = useState<boolean>(false)

  useEffect(() => {
    const fetchCourseAnalytics = async () => {
      setFetchingCourseAnalytics(true)
      let url = `/api/courses/${courseId}/analytics`
      url += type ? `?type=${type}` : ''
      const res = await fetch(url)
      const fetchedCourseAnalytics = ((await res.json()) as CourseAnalyticsType) || null
      setCourseAnalytics(fetchedCourseAnalytics)
    }

    fetchCourseAnalytics().finally(() => setFetchingCourseAnalytics(false))
  }, [type, courseId])

  return { courseAnalytics, fetchingCourseAnalytics }
}

interface CourseAnalyticsType {
  id: number
  title: string
  students: {
    id: number
    name: string
    courseItemLogs: {
      completed: boolean
      courseItem: {
        type: 'module' | 'quiz'
        id: number
        title: string
        score: number
      }
    }[]
  }[]
}
