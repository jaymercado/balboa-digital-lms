'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { Course } from '@/types/courseType'
import useGetCourses from '@/hooks/useGetCourses'
import toast from '@/utils/toast'

export default function EditCourse() {
  const router = useRouter()
  const params = useParams()
  const courseId = params.id as string

  const { courses, fetchingCourses } = useGetCourses({ courseId })
  const [deletingCourse, setDeletingCourse] = useState('')

  function deleteCourse(courseId: string) {
    setDeletingCourse(courseId)
    fetch(`/api/courses/${courseId}`, {
      method: 'DELETE',
    })
      .then((res) => res.json())
      .then((deletedCourse: Course) => {
        toast('success', 'Course deleted successfully')
        router.push('/managed-courses')
      })
      .catch((err) => {
        console.error(err)
        toast('error', 'Error deleting course')
      })
      .finally(() => setDeletingCourse(''))
  }

  if (fetchingCourses) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <Link href={`/managed-courses/${courses[0]?._id}/edit`}>Edit</Link> /
      <button
        type="button"
        onClick={() => deleteCourse(courses[0]?._id)}
        disabled={deletingCourse === courses[0]?._id}
      >
        Delete
      </button>
      <p>Course ID: {courseId}</p>
      <p>Title: {courses[0]?.title}</p>
      <p>Description: {courses[0]?.description}</p>
      <p>Enrollees: {courses[0]?.enrollees}</p>
      <p>Instructors: {courses[0]?.instructors}</p>
    </div>
  )
}

type Inputs = {
  title: string
  description: string
  enrollees: string[]
  instructors: string[]
}
