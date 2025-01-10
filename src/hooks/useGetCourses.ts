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
  const [fetchingCourse, setFetchingCourse] = useState<boolean>(false)

  useEffect(() => {
    const fetchCourse = async () => {
      setFetchingCourse(true)
      let url = `/api/courses/${courseId}`
      const res = await fetch(url)
      const fetchedCourse = ((await res.json()) as CourseType) || null
      setCourse(fetchedCourse)
    }

    fetchCourse().finally(() => setFetchingCourse(false))
  }, [courseId])

  return { course, setCourse, fetchingCourse }
}
