import React, { useState, useEffect } from 'react'
import { useGetCourses } from './useGetCourses' // Hook for fetching enrolled courses

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

      return logs
    } catch (error) {
      console.error('Error fetching course item logs:', error)
      return []
    }
  }

  // Function to fetch all course items in parallel
  const fetchAllCourseItems = async (courseIds: string[]) => {
    try {
      const items = await Promise.all(
        courseIds.map((courseId) =>
          fetch(`/api/courses/${courseId}/items`)
            .then((res) => res.json())
            .then((data) => ({ courseId, items: data })),
        ),
      )

      return items
    } catch (error) {
      console.error('Error fetching course items:', error)
      return []
    }
  }

  useEffect(() => {
    const fetchUserCourseItemLogs = async () => {
      if (!courses || courses.length === 0) return // If no courses, return early

      // Limit the courses to the first 5
      const coursesToFetch = courses.slice(0, 5)

      setFetchingUserCourseItemLogs(true)

      try {
        // Fetch course items and course item logs for the first 5 courses in parallel
        const [items, logs] = await Promise.all([
          fetchAllCourseItems(coursesToFetch.map((course) => course.id)),
          fetchAllCourseItemLogs(coursesToFetch.map((course) => course.id)),
        ])

        const updatedCourses = coursesToFetch.map((course) => {
          // Find the course items and course item logs for the current course
          const courseItems = items.find((itemData) => itemData.courseId === course.id)?.items || []
          const courseLogs = logs.find((logData) => logData.courseId === course.id)?.logs || []

          // Check the lengths
          if (courseLogs.length === 0) {
            return { ...course, status: 'notStarted' } // No logs means "Not Started"
          }

          if (courseLogs.length < courseItems.length) {
            return { ...course, status: 'inProgress' } // Some course items don't have logs yet
          }

          return { ...course, status: 'completed' } // All items have corresponding logs
        })

        setCoursesWithCompletionStatus(updatedCourses) // Set the updated courses with completion status
      } catch (error) {
        console.error('Error fetching course items or logs:', error)
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
