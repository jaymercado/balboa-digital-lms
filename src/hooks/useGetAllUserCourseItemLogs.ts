import React, { useState, useEffect } from 'react'
import { UserCourseItemLog } from '@/types/userCourseItemLog'
import { useGetCourses } from './useGetCourses' // Assuming you have this hook

export function useGetAllUserCourseItemLogs() {
  const { courses, fetchingCourses } = useGetCourses({ type: 'enrolled' }) // Fetch enrolled courses
  const [fetchingUserCourseItemLogs, setFetchingUserCourseItemLogs] = useState<boolean>(false)
  const [coursesWithCompletionStatus, setCoursesWithCompletionStatus] = useState<any[]>([]) // Courses with completion status

  // Function to fetch all course item logs in parallel
  const fetchAllCourseItemLogs = async (courseIds: string[]) => {
    try {
      const logs = await Promise.all(
        courseIds.map((courseId) =>
          fetch(`/api/courses/${courseId}/userCourseItemLogs`)
            .then((res) => res.json())
            .then((data) => ({ courseId, logs: data })),
        ),
      )

      console.log('Fetched course item logs:', logs)
      return logs
    } catch (error) {
      console.error('Error fetching course item logs:', error)
      return []
    }
  }

  useEffect(() => {
    const fetchUserCourseItemLogs = async () => {
      if (!courses || courses.length === 0) return // If no courses, return early

      setFetchingUserCourseItemLogs(true)

      try {
        // Fetch all logs in parallel
        const logs = await fetchAllCourseItemLogs(courses.map((course) => course.id))

        const updatedCourses = courses.map((course) => {
          const courseLogs = logs.find((logData) => logData.courseId === course.id)?.logs || []

          // If no course item logs exist for this course, consider it "Not Started"
          if (courseLogs.length === 0) {
            return { ...course, status: 'notStarted' } // No logs means "Not Started"
          }

          // Check if all course items are completed
          const isCompleted = courseLogs.every((log: UserCourseItemLog) => log.completed)

          return { ...course, status: isCompleted ? 'completed' : 'inProgress' }
        })

        setCoursesWithCompletionStatus(updatedCourses) // Set the updated courses with completion status
      } catch (error) {
        console.error('Error fetching user course item logs:', error)
      } finally {
        setFetchingUserCourseItemLogs(false)
      }
    }

    if (!fetchingCourses) {
      fetchUserCourseItemLogs() // Fetch logs only when courses are fetched
    }
  }, [courses, fetchingCourses])

  return { fetchingUserCourseItemLogs, coursesWithCompletionStatus }
}
