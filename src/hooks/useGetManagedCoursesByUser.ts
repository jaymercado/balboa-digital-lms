import React, { useState, useEffect } from 'react'
import { Course as CourseType } from '@/types/Course'
import { Course } from '@/models'

const useGetManagedCoursesByUser = () => {
  const [managedCourses, setManagedCourses] = useState<CourseType[]>([])

  useEffect(() => {
    const fetchManagedCourses = async () => {
      const res = await fetch('/api/courses?type=managed')
      const data = await res.json()
      console.log(data)
      setManagedCourses([])
    }
    fetchManagedCourses()
  }, [])
}

export default useGetManagedCoursesByUser
