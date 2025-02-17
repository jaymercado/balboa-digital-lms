import React, { useState, useEffect } from 'react'
import { Course as CourseType } from '@/types/course'

export function useGetCourses({
  type,
  courseId,
}: {
  type?: 'managed' | 'enrolled'
  courseId?: string
}) {
  const [courses, setCourses] = useState<CourseType[]>([])
  const [fetchingCourses, setFetchingCourses] = useState<boolean>(false)

  useEffect(() => {
    const fetchCourses = async () => {
      setFetchingCourses(true)

      let url = `/api/courses`
      url += courseId ? `/${courseId}` : ''
      url += type ? `?type=${type}` : ''

      const res = await fetch(url)
      const fetchedCourses = ((await res.json()) as CourseType[]) || []
      setCourses(fetchedCourses)
    }

    fetchCourses().finally(() => setFetchingCourses(false))
  }, [type, courseId])

  return { courses, setCourses, fetchingCourses }
}

export function useGetCourse({ courseId }: { courseId: string }) {
  const [course, setCourse] = useState<CourseType | null>(null)
  const [fetchingCourse, setFetchingCourse] = useState<boolean>(true)
  const [courseNotFound, setCourseNotFound] = useState<boolean>(false)

  useEffect(() => {
    const fetchCourse = async () => {
      setFetchingCourse(true)
      try {
        const res = await fetch(`/api/courses/${courseId}`)

        if (!res.ok) {
          if (res.status === 404) {
            setCourseNotFound(true)
          }
          throw new Error('Course not found or invalid request')
        }

        const fetchedCourse = (await res.json()) as CourseType
        setCourse(fetchedCourse)
      } catch (error) {
        console.error('Error fetching course:', error)
        setCourseNotFound(true)
      } finally {
        setFetchingCourse(false)
      }
    }

    fetchCourse()
  }, [courseId])

  return { course, fetchingCourse, courseNotFound }
}
